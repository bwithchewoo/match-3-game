class UserSerializer < ActiveModel::Serializer
  attributes :id, :username, :password, :image_url, :bio
  has_many :boards
  has_many :user_achievements
  has_many :achievements
  has_many :friendships
  has_many :inverse_friendships
  has_many :friends
  has_many :inverse_friends
end
