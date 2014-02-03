require 'bundler/setup'
require 'sinatra'
require 'json'
require 'alarm_decoder'

set :server, :thin

get '/' do
  haml :keypad
end

get '/stylesheets/custom.css' do
  sass :custom, :style => :expanded
end

post '/write' do
  AlarmDecoder.write params['key']
end

get '/stream', provides: 'text/event-stream' do
  stream :keep_open do |out|
    AlarmDecoder.watch do |status|
      json_status = JSON.pretty_generate(status).split("\n").
        map {|s| "data: #{s}\n" }.join
      out << json_status + "\n"
    end
  end
end
