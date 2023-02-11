class CreateBoards < ActiveRecord::Migration[6.1]
  def change
    create_table :boards do |t|

      t.integer :user_id
      t.string :board_name
      t.integer :anemo_score
      t.integer :dendro_score
      t.integer :electro_score
      t.integer :geo_score
      t.integer :hydro_score
      t.integer :pyro_score
      t.integer :powerups_used
    end
  end
end
