require 'bundler/setup'
require 'dotenv'
require 'sinatra'
require 'sinatra/namespace'
require 'json'
require 'alarm_decoder'

Dotenv.load

set :server, :thin

get '/stylesheets/custom.css' do
  sass :custom, :style => :expanded
end

namespace "/#{ENV['ALARM_KEYPAD_SECRET']}" do
  get do
    haml :keypad
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
end
