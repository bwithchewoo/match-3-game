class FriendshipsController < ApplicationController
  skip_before_action :authorize

def create
  user_id = params[:user_id]
user = User.includes(:friends, :inverse_friends).find(user_id)

    friendship = Friendship.create!(friendship_params)
    friend = User.find(friendship.friend_id)
    render json: {user: user, friend: friend}, status: :created
end

#use current users

private
def friendship_params
  params.permit(:user_id, :friend_id)
end



end
