class AchievementsController < ApplicationController
  skip_before_action :authorize
  def index
    render json: Achievement.all
  end
  def create
    achievement = Achievement.create!(achievement_params)
    render json: achievement, status: :created
  end
  private

  def achievement_params
    params.permit(:achievement_name, :achievement_description)
  end
end
