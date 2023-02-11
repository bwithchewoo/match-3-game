class BoardSerializer < ActiveModel::Serializer
  attributes :id, :board_name, :user_id, :anemo_score, :dendro_score, :electro_score, :geo_score, :hydro_score,:pyro_score,:powerups_used
  has_many :pieces
  belongs_to :user
end
