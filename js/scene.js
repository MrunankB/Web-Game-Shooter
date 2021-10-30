/*
 * Sprites
 */
var sprites = [
    'default.png',
    'laser.png',
    'player.png'
];

/*
 * Particle
 */
var particlePrefab = new GameObject()
particlePrefab.AddComponent(new ParticleScript());

/*
 * Player
 */
var playerPrefab = new GameObject();
playerPrefab.name = "Player";
playerPrefab.tag = "Player";
playerPrefab.AddComponent(new SpriteRenderer('player.png'));
playerPrefab.AddComponent(new BoxCollider());
playerPrefab.AddComponent(new PlayerScript());

/*
 * Bullets
 */
var bulletPrefab = new GameObject();
bulletPrefab.AddComponent(new SpriteRenderer('default.png', 100));
bulletPrefab.AddComponent(new BulletScript());
bulletPrefab.AddComponent(new BoxCollider());

/*
 * Enemy Manager
 */
var enemyManagerPrefab = new GameObject();
enemyManagerPrefab.name = "Enemy Manager";
enemyManagerPrefab.AddComponent(new EnemyManagerScript());

/*
 * Enemy GameObject
 */
var enemyPrefab = new GameObject();
enemyPrefab.name = "Enemy";
enemyPrefab.tag = "Enemy";
enemyPrefab.color = "red";
enemyPrefab.AddComponent(new EnemyScript());
enemyPrefab.AddComponent(new SpriteRenderer('player.png'));
enemyPrefab.AddComponent(new BoxCollider());

/*
 * Crosshair
 */
var crosshairPrefab = new GameObject();
crosshairPrefab.AddComponent(CrosshairScript);


/* Hierarchy */
var player = GameObject.Instantiate(playerPrefab);
var enemyManager = GameObject.Instantiate(enemyManagerPrefab);
var crosshair = GameObject.Instantiate(crosshairPrefab);
