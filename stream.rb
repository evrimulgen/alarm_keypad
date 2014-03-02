class Stream
  def self.streams
    @streams ||= []
  end

  def self.enabled?
    unless defined? @enabled
      @enabled = true
    end
    @enabled
  end

  def self.disable!
    @enabled = false
    streams.flatten.each(&:close!)
  end

  def self.publish(event, message)
    streams.each {|c| c.publish(event, message) }
  end

  attr_reader :out, :id

  def initialize(out)
    @id  = SecureRandom.uuid
    @out = out

    subscribe

    @timer = EventMachine::PeriodicTimer.new(
      20, method(:keepalive)
    )

    setup
  end

  def subscribe
    self.class.streams << self
  end

  def close!
    @timer.cancel

    self.class.streams.delete(self)
  end

  def publish(event, message)
    self << "event: #{event}\n"
    #json_status = JSON.pretty_generate(status).split("\n").
    #  map {|s| "data: #{s}\n" }.join
    #self << json_status + "\n"
    self << "data: #{message}\n\n"
  end

  protected

  def <<(data)
    return close! if out.closed?
    out << data
  end

  # Only keep streams alive for so long
  def keepalive_timeout?
    @keepalive_count ||= 0
    @keepalive_count += 1
    @keepalive_count > 10
  end

  def keepalive
    return close! if keepalive_timeout?
    publish(:keepalive, '')
  end

  def setup
    publish(:setup, id)
    self << "retry: 5000\n"
  end
end
