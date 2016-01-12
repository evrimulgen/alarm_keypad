module LastUpdate
  extend self;

  def garage_door
    @garage_door
  end

  def garage_door=(status)
    @garage_door = status
  end

  def alarm
    @alarm
  end

  def alarm=(status)
    @alarm = status
  end
end
