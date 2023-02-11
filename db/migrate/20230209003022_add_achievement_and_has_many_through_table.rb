class AddAchievementAndHasManyThroughTable < ActiveRecord::Migration[6.1]
  def change
    create_table :user_achievements do |t|
      t.belongs_to :user, index: true
      t.belongs_to :achievement, index: true
    end
  end
end
