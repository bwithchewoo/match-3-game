class UsersController < ApplicationController
  skip_before_action :authorize, only: [:create, :index ]

  def index
    render json: User.all.pluck(:id, :username)
  end
  def create
    user = User.create!(user_params)
    session[:user_id] = user.id
    render json: user, status: :created
  end

  def show
    render json: @current_user
  end
#all achievements that are associated to current user with fun in the name
  def achievement
    user = User.find_by(id: session[:user_id])
    funachievement = User.joins(:achievements).where("achievements.achievement_name LIKE ?", "%fun%")

    render json: funachievement
  end

  private

  def user_params
    params.permit(:username, :password, :password_confirmation, :image_url, :bio)
  end

end
