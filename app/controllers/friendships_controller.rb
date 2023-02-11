class FriendshipsController < ApplicationController
  skip_before_action :authorize

def create
    friendship = Friendship.create!(friendship_params)
    render json: friendship, status: :created
end

#use current users

private
def friendship_params
  params.permit(:user_id, :friend_id)
end



end
