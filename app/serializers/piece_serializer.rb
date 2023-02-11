class PieceSerializer < ActiveModel::Serializer
  attributes :id, :row, :column, :color, :board_id

end
