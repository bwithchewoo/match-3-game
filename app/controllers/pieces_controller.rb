class PiecesController < ApplicationController

  skip_before_action :authorize
  def index
    render json: Piece.all
  end


  def show
    piece = Piece.find(params[:id])
    render json: piece
  end

  def create
    piece = Piece.create!(piece_params)
    render json: piece, status: :created
  end

  def destroy
    piece = Piece.find(params[:id])
    piece.destroy
    head :no_content
  end


  def update_all
    pieces = params[:someParamKey]
    bla = pieces[2]
    for a in pieces do
      piece = Piece.find(a[:id])
      piece.update!({
        "board_id" => a[:board_id],
        "row" => a[:row],
        "column" => a[:column],
        "color" => a[:color]
      })
    end
  end
  private

  def piece_params
    params.permit(:board_id, :row, :column, :color)
  end
end
