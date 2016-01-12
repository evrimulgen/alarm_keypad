module StatusCache
  extend self;

  def garage_door
    @garage_door
  end

  def garage_door=(status)
    last_update!
    @garage_door = status
  end

  def alarm
    @alarm
  end

  def alarm=(status)
    last_update!
    @alarm = status
  end

  def last_update!
    @last_update = Time.now
  end

  def last_update
    @last_update
  end
end
