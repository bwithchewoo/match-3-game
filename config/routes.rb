Rails.application.routes.draw do
  resources :pieces, except: :update
  resources :boards, only: [:index, :create]

  resources :achievements, only: [:index, :create]
  resources :user_achievements, only: [:index, :create]
  resources :friendships, only: [ :create]
delete "/boards/:id", to: "boards#destroy"
  get "/users", to: "users#index"
  get "/funachievements", to: "users#achievement"

  post "/signup", to: "users#create"
  post "/login", to: "sessions#create"
  delete "/logout", to: "sessions#destroy"
  get "/me", to: "users#show"
  get "/boards/:user_id", to: "boards#user_board"
  patch "/updateboard", to: "pieces#update_all"
  patch "/updatescore", to: "boards#update_score"
  # Routing logic: fallback requests for React Router.
  # Leave this here to help deploy your app later!
  get "*path", to: "fallback#index", constraints: ->(req) { !req.xhr? && req.format.html? }
end
