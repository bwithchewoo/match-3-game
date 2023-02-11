class UserAchievementsController < ApplicationController
  skip_before_action :authorize
  def index
    render json: UserAchievement.all
  end
  def create
    userachievement = UserAchievement.find_or_create_by!(user_achievement_params)
    render json: userachievement, status: :created
  end
  private

  def user_achievement_params
    params.permit(:achievement_id, :user_id)
  end
end
