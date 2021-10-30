/*
 * Scripts for GameObjects go here
 */
class PlayerScript extends Component
{
    constructor() 
    {
        super();
        this.speed = 200;
        this.shootRate = 0.1;
        this.shootTimer = 0;
        this.health = 100;
    }
    Start()
    {
        this.gameObject.tag = "Player";
        this.transform.scale = 0.6;
    }
    Update()
    {
        var mousePos = Input.GetMousePosition();
        var direction = new Vector(0, 0);
        direction = mousePos.subtract(this.transform.position);
        direction = direction.normalized();
        this.transform.rotation = direction.toAngles().pi;

        var max = Vector.max(direction, mousePos);

        // Have a shoot timer that counts up in seconds using deltaTIme
        this.shootTimer += Time.deltaTime;
        // If the shoot timer has reached the shoot rate
        if (this.shootTimer >= this.shootRate) {
            // Check if the space button was pressed
            if (Input.GetMouseButtonDown('left')) {
                // If it was, shoot the bullet
                this.Shoot(direction);

                // Reset the timer
                this.shootTimer = 0;

                // NOTE: See how shootTimer is inside the keypress if statement and not the timer?
                // That's because we want to reset the timer AFTER we shoot the weapon.
            }
        }

        // Movement in different directions
        if (Input.GetKey('left') || Input.GetKey('a')) {
            this.transform.position.x -= this.speed * Time.deltaTime;
        }
        if (Input.GetKey('right') || Input.GetKey('d')) {
            this.transform.position.x += this.speed * Time.deltaTime;
        }
        if (Input.GetKey('up') || Input.GetKey('w')) {
            this.transform.position.y -= this.speed * Time.deltaTime;
        }
        if (Input.GetKey('down') || Input.GetKey('s')) {
            this.transform.position.y += this.speed * Time.deltaTime;
        }

        // Clamp the value of the player's movment so that they can 
        this.transform.position.x = Math.min(Math.max(this.transform.position.x, 0), canvas.width - this.transform.scale);
        this.transform.position.y = Math.min(Math.max(this.transform.position.y, 0), canvas.height - this.transform.scale);
    }
    Shoot(direction)
    {
        // Pre-set the bullet's position to the middle of the player 
        // That way it fires from the center of the player
        var bulletPosition = new Vector(this.transform.position.x, this.transform.position.y);

        // Calculate velocity to be the normal of the direction 
        // from the player to the mouse
        var mousePos = Input.GetMousePosition();

        // Create a new bullet using the 'Bullet' function
        var bullet = this.Instantiate(bulletPrefab);
        var bulletScript = bullet.GetComponent(BulletScript);
        if (bulletScript != null)
        {
            bulletScript.transform.position = bulletPosition;
            bulletScript.transform.rotation = this.transform.rotation;
            bulletScript.velocity = direction;
        }

        var fireSound = new Audio("resources/sounds/fire.wav");
        fireSound.play();
    }
    OnCollisionEnter(col)
    {
        console.log(col.name + " has collided with " + this.name);
    }
}

class EnemyManagerScript extends Component
{
    constructor() 
    {
        super();
        
        this.spawnRate = 5;
        this.spawnTimer = 0;
    }
    Start() 
    {

    }
    Update()
    {
        this.transform.position.x += 0.4 * Time.deltaTime;

        this.spawnTimer += Time.deltaTime;
        if (this.spawnTimer >= this.spawnRate) {
            var randomPos = new Vector();
            randomPos.x = random(0, canvas.width);
            randomPos.y = random(0, canvas.height);

            var enemy = this.Instantiate(enemyPrefab);
            var enemyScript = enemy.GetComponent(EnemyScript);
            if (enemyScript != null)
            {
                enemyScript.transform.position = randomPos;
                enemyScript.speed = random(50, 80);
            }

            this.spawnTimer = 0;
        }
    }
}

class EnemyScript extends Component
{
    constructor(name, speed, damage, attackRate, attackTimer) 
    {
        super();
        this.name = name || "Enemy " + this.instanceId;
        this.speed = speed || 20.0;
        this.damage = damage || 1.0;
        this.attackRate = attackRate || 1.0;
        this.attackTimer = attackTimer || 0;
    }
    Start()
    {
        this.transform.scale = 0.4;
        this.gameObject.tag = "Enemy";
    }
    Update()
    {
        var direction = player.transform.position.subtract(this.transform.position);
        direction = direction.normalized();

        this.transform.rotation = direction.toAngles().pi;

        this.transform.position.x += direction.x * this.speed * Time.deltaTime;
        this.transform.position.y += direction.y * this.speed * Time.deltaTime;

        this.attackTimer += Time.deltaTime;
    }
    OnCollisionStay(col)
    {
        if (col.gameObject.tag == "Player") {
            if (this.attackTimer >= this.attackRate) {
                col.health -= this.damage;
                this.attackTimer = 0;
            }
        }
    }
}

class BulletScript extends Component
{        
    constructor()
    {
        super();
        this.speed = 1000.0;
        this.velocity = new Vector();
        this.direction = new Vector(0, 0);
    }

    Start()
    {
        this.transform.scale = 0.1;
    }

    IsWithinBounds()
    {
        var pos = this.transform.position;
        if (pos.x >= 0 && pos.x <= canvas.width &&
            pos.y >= 0 && pos.y <= canvas.height) {
            return true;
        }

        this.CreateExplosion(this.transform.position, 2, 40, "#525252");
        this.CreateExplosion(this.transform.position, 2, 60, "#FFA318");
        return false;
    }
    
    Update()
    {
        this.transform.position.x += this.velocity.x * this.speed * Time.deltaTime;
        this.transform.position.y += this.velocity.y * this.speed * Time.deltaTime;
        if (!this.IsWithinBounds()) {
            var bulletSound = new Audio("resources/sounds/explosion.wav");
            bulletSound.play();
            this.Destroy(this.gameObject);
        }
    }
    
    OnCollisionStay(col)
    {
        if (col.gameObject.tag == "Enemy") {
            var bulletSound = new Audio("resources/sounds/explosion.wav");
            bulletSound.play();
            this.Destroy(col.gameObject);
            this.Destroy(this.gameObject);
            this.CreateExplosion(col.transform.position, 5, 40, "#525252");
            this.CreateExplosion(col.transform.position, 5, 80, "#FFA318");
        }
    }

    CreateExplosion(position, count, speed, color)
    {
        // Creating 4 particles that scatter at 0,d 90, 180 & 270 degrees
        for (var i = 0; i < count; i++) {
            var particle = GameObject.Instantiate(particlePrefab);
            var particleScript = particle.GetComponent(ParticleScript);
            particleScript.speed = speed;
            particleScript.color = color;

            // Particle will start at explosion center
            particleScript.transform.position = new Vector(position.x, position.y);
            particleScript.velocity.x = random(-particleScript.speed, particleScript.speed);
            particleScript.velocity.y = random(-particleScript.speed, particleScript.speed);
        }
    }
}

class ParticleScript extends Component
{
    constructor()
    {
        super();

        this.radius = 20;
        this.scaleSpeed = 1;
        this.speed = 100.0;
        this.color = "black";
    }
    Start()
    {
      this.transform.scale = 1.0;
      this.velocity = new Vector(0, 0);
    }
    Update()
    {
        // Shrinking
        this.transform.scale -= this.scaleSpeed * Time.deltaTime;

        if (this.transform.scale <= 0) {
            this.Destroy(this.gameObject);
        }
        
        // Moving away from explosion center
        this.transform.position.x += this.velocity.x * Time.deltaTime;
        this.transform.position.y += this.velocity.y * Time.deltaTime;
    }
    Draw()
    {
        // translating the particle's coordinates
        context.save();
        context.translate(this.transform.position.x, this.transform.position.y);
        context.scale(this.transform.scale, this.transform.scale);

        context.beginPath();
        context.fillStyle = this.color;
        context.arc(0, 0, this.radius, 0, Math.PI * 2, true);
        context.fill();
        context.closePath();

        context.restore();
    }
}

/*
 * Crosshair
 */
class CrosshairScript extends Component
{
    constructor()
    {
        super();
        this.radius = 30;
    }

    Start()
    {
        $('body').css('cursor', 'none');
    }

    Update()
    {
        this.transform.position = Input.GetMousePosition();
    }

    Draw()
    {
        context.save();
        context.translate(this.transform.position.x, this.transform.position.y);
        context.scale(this.transform.scale, this.transform.scale);

        // Draw first circle
        context.beginPath();
        context.strokeStyle = this.color;
        context.arc(0, 0, this.radius, 0, Math.PI * 2);
        context.stroke();
        context.closePath();

        // Draw second circle
        context.beginPath();
        context.fillStyle = this.color;
        context.arc(0, 0, this.radius * 0.25, 0, Math.PI * 2);
        context.fill();
        context.closePath();

        context.restore();
    }
}

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