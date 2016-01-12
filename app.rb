require 'bundler/setup'
require 'dotenv'
require 'sinatra'
require 'json'
require 'haml'
require 'sass'
require 'alarm_decoder'
require_relative './stream'
require_relative './status_cache'
require 'sinatra/json'

begin
  require 'garage_door'
rescue LoadError
  puts "Can't load garage door. You're probably dev-ing on a non raspberrypi. That's cool"
  module GarageDoor
    def self.state
      'open'
    end
  end
end

Dotenv.load

set :server, :thin
namespace = ENV['ALARM_KEYPAD_SECRET']

# Setup Redis
Thread.abort_on_exception = true

trap('TERM') do
  Stream.disable!
  Process.kill('INT', $$)
end

EM::next_tick do
  Thread.new do
    AlarmDecoder.watch do |status|
      Stream.publish(:status, status.to_json)
      StatusCache.alarm = status
    end
  end
  EventMachine::PeriodicTimer.new(3) do
    Stream.publish(:garage_door, GarageDoor.state)
    StatusCache.garage_door = GarageDoor.state
  end
end


get '/stylesheets/custom.css' do
  sass :custom, :style => :expanded
end

get "/#{namespace}" do
  haml :keypad
end

get "/#{namespace}/status.json" do
  json alarm:        StatusCache.alarm,
       garage_door:  StatusCache.garage_door,
       last_updated: StatusCache.last_updated
end

post "/#{namespace}/write" do
  AlarmDecoder.write(params['key'])
end

post "/#{namespace}/panic" do
  AlarmDecoder.panic!
end

post "/#{namespace}/toggle" do
  GarageDoor.toggle
end

get "/#{namespace}/stream", provides: 'text/event-stream' do
  error 402 unless Stream.enabled?

  stream(:keep_open) do |out|
    stream = Stream.new(out)
    out.callback { stream.close! }
    out.errback  { stream.close! }
  end
end
