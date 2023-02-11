class CreatePieces < ActiveRecord::Migration[6.1]
  def change
    create_table :pieces do |t|

      t.integer :board_id
t.integer :row
t.integer :column
t.string :color
    end
  end
end
