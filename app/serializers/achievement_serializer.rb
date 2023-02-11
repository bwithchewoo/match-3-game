class AchievementSerializer < ActiveModel::Serializer
  attributes :id, :achievement_name, :achievement_description
  has_many :user_achievements
end
