# frozen_string_literal: true

class ProfilePolicy < ApplicationPolicy
  def show?
    user
  end

  def remove_avatar?
    user
  end

  def update?
    user
  end
end
