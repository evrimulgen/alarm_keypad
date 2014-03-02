require 'bundler/setup'
require 'dotenv'
require 'sinatra'
require 'sinatra/namespace'
require 'json'
require 'alarm_decoder'
require_relative './stream'

Dotenv.load

set :server, :thin

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
    end
  end
end

get '/stylesheets/custom.css' do
  sass :custom, :style => :expanded
end

namespace "/#{ENV['ALARM_KEYPAD_SECRET']}" do
  get do
    haml :keypad
  end

  post '/write' do
    AlarmDecoder.write(params['key'])
  end

  get '/stream', provides: 'text/event-stream' do
    error 402 unless Stream.enabled?

    stream(:keep_open) do |out|
      stream = Stream.new(out)
      out.callback { stream.close! }
      out.errback  { stream.close! }
    end
  end
end
