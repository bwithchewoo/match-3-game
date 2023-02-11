class Board < ApplicationRecord
  belongs_to :user
  has_many :pieces, dependent: :delete_all
end
