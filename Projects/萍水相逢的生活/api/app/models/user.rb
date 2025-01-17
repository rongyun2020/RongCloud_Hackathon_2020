class User < ActiveRecord::Base
  validates :mobile, presence: true, uniqueness: true
  validates :name, presence: true

  belongs_to :default_scene, class_name: 'Scene' # 这里使用 has_one 会有问题
  has_many :scenes

  def to_token
    Token.encode(self.id)
  end

  def self.from_token(token)
    Token.decode(token)
  end

  def create_scene(scene_params)
    scene = Scene.new(scene_params)
    scene.nickname = self.name unless scene.nickname?
    scene.avatar = self.avatar unless scene.avatar?
    scene.user = self
    scene.save!
    scene.update!(number: scene.id)
    scene
  end
end
