class BoardsController < ApplicationController
  skip_before_action :authorize
  def index
    boards = Board.all
    render json: boards
  end

  def create
    board = Board.create!(board_params)
    render json: board, status: :created
  end

  def update_score
    board = Board.find(params[:id])
    board.update!({
      "anemo_score" => params[:anemo_score],
      "dendro_score" => params[:dendro_score],
      "electro_score" => params[:electro_score],
      "geo_score" => params[:geo_score],
      "hydro_score" => params[:hydro_score],
      "pyro_score" => params[:pyro_score]
      })
    render json: board
  end

def user_board
  boards = Board.where(user_id: params[:user_id])
  render json: boards
end

def destroy
  board= Board.find(params[:id])
  board.destroy
  head :no_content

end


  private

  def board_params
    params.permit(:board_name, :user_id, :anemo_score, :dendro_score, :electro_score, :geo_score, :hydro_score, :pyro_score, :powerups_used)
  end
end
