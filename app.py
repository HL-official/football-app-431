from fastapi import FastAPI, HTTPException, Body, Depends
import sqlite3
from sqlite3 import connect, Error
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
from typing import List, Optional, Tuple
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class LoginRequest(BaseModel):
    User_id: str
    Password: str

# FastAPI app instance
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# Database configuration
DATABASE_PATH = 'db2.sqlite'

# Password context for hashing and verifying passwords
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# class TeamAttribute(BaseModel):
#     attribute_name: str
#     attribute_value: int

# class PlayerAttribute(BaseModel):
#     attribute_name: str
#     attribute_value: int    


def create_connection(db_file):
    """ Create a database connection to the SQLite database """
    conn = None
    try:
        conn = sqlite3.connect(db_file)
    except Error as e:
        print(e)

    return conn
    
@app.post("/login/")
async def login(login_request: LoginRequest):
    User_Id = login_request.User_id
    Password = login_request.Password

    conn = create_connection(DATABASE_PATH)
    if conn:
        try:
            cursor = conn.cursor()
            cursor.execute("SELECT Password FROM User WHERE User_Id = (?) ", (User_Id,))
            stored_password = cursor.fetchone()
            
            if stored_password and stored_password[0] == Password:
                
                return {"message": "User authenticated"}
            else:
                return {"message": "Invalid credentials \nCheck credentials or Sign Up"}
        except Error as e:
            logging.error(f"An error occurred in the database operation: {e}")
            print(f"An error occurreddd: {e}")
            return {"message": "An error occurred"}, 500
        finally:
            conn.close()
    else:
        return {"message": "Error connecting to the database"}, 500   


def add_player(player_data):
    conn = create_connection(DATABASE_PATH)
    if conn:
        try:
            conn.execute("BEGIN;")
            conn.execute("INSERT INTO Player (player_api_id, player_name, player_fifa_api_id, birthday, height, weight) VALUES (?, ?, ?, ?, ?, ?)", player_data)
            conn.execute("COMMIT;")
        except Error as e:
            conn.execute("ROLLBACK;")
            raise e
        finally:
            conn.close()


def add_player_attributes(player_api_id, attributes):
    conn = create_connection(DATABASE_PATH)
    if conn:
        try:
            conn.execute("BEGIN;")
            conn.execute("""
                INSERT INTO Player_Attributes (player_api_id, overall_rating, finishing, dribbling, passing, sprint_speed, strength, gk_diving, gk_reflexes)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (player_api_id, attributes['overall_rating'], attributes['finishing'], attributes['dribbling'], attributes['passing'], attributes['sprint_speed'], attributes['strength'], attributes['gk_diving'], attributes['gk_reflexes']))
            conn.execute("COMMIT;")
        except Error as e:
            conn.execute("ROLLBACK;")
            raise e
        finally:
            conn.close()


def remove_player(player_id):
    conn = create_connection(DATABASE_PATH)
    if conn:
        try:
            conn.execute("DELETE FROM Player WHERE id = ?", (player_id,))
            conn.commit()
        except Error as e:
            conn.rollback()
            raise e
        finally:
            conn.close()

def update_player(player_data, player_api_id):
    print(player_api_id,player_data.height)
    conn = create_connection(DATABASE_PATH)
    if conn:
        try:
            conn.execute("BEGIN;")

            # Update Player table
            conn.execute("""
                UPDATE Player
                SET player_name = ?, height = ?, weight = ?
                WHERE player_api_id = ?;
            """, (player_data.player_name, player_data.height, player_data.weight, player_api_id))

            # Update Player_Attributes table
            conn.execute("""
                UPDATE Player_Attributes
                SET overall_rating = ?, finishing = ?, dribbling = ?, passing = ?, sprint_speed = ?, strength = ?, gk_diving = ?, gk_reflexes = ?
                WHERE player_api_id = ?;
            """, (player_data.overall_rating, player_data.finishing, player_data.dribbling, player_data.passing, player_data.sprint_speed, player_data.strength, player_data.gk_diving, player_data.gk_reflexes, player_api_id))

            conn.execute("COMMIT;")
        except Error as e:
            print("Error:", e)
            conn.execute("ROLLBACK;")
            raise e
        finally:
            conn.close()

from typing import Optional

class PlayerUpdate(BaseModel):
    player_name: Optional[str] = Field(None)
    height: Optional[int] = Field(None)
    weight: Optional[int] = Field(None)
    overall_rating: Optional[int] = Field(None)
    finishing: Optional[int] = Field(None) 
    dribbling: Optional[int] = Field(None) 
    passing: Optional[int] = Field(None) 
    sprint_speed: Optional[int] = Field(None)
    strength: Optional[int] = Field(None) 
    gk_diving: Optional[int] = Field(None) 
    gk_reflexes: Optional[int] = Field(None)

class PlayerAttributes(BaseModel):
    overall_rating: int
    finishing: int
    dribbling: int
    passing: int
    sprint_speed: int
    strength: int
    gk_diving: int
    gk_reflexes: int

class TeamAttributes(BaseModel):
    buildUpPlaySpeed: int
    buildUpPlayPassing: int
    chanceCreationPassing: int
    defencePressure: int
    defenceAggression: int
    defenceTeamWidth: int
class UserData(BaseModel):
    user_id: Optional[str]
    favorite_team: Optional[str]
    favorite_team_attributes: TeamAttributes
    favorite_player: Optional[str]
    favorite_player_attributes: PlayerAttributes

def add_team(team_data):
    conn = create_connection(DATABASE_PATH)
    if conn:
        try:
            conn.execute("BEGIN;")
            conn.execute("INSERT INTO Team (team_api_id, team_fifa_api_id, team_long_name, team_short_name) VALUES (?, ?, ?, ?)", team_data)
            conn.execute("COMMIT;")
        except Error as e:
            conn.execute("ROLLBACK;")
            raise e
        finally:
            conn.close()

def add_match(match_data):
    conn = create_connection(DATABASE_PATH)
    if conn:
        try:
            conn.execute("BEGIN;")
            conn.execute("INSERT INTO Match (country_id, league_id, season, stage, date, match_api_id, home_team_api_id, away_team_api_id, home_team_goal, away_team_goal) VALUES (?, ?, ?, ?, ?, ? ,?, ?, ?, ?)", match_data)
            conn.execute("COMMIT;")
        except Error as e:
            conn.execute("ROLLBACK;")
            raise e
        finally:
            conn.close()

def add_user(user_data):
    conn = create_connection(DATABASE_PATH)
    if conn:
        try:
            conn.execute("BEGIN;")
            conn.execute("INSERT INTO User (User_Id, Password, Favorite_Team_API_ID, Favorite_Player_API_ID) VALUES (?, ?, ?, ?)", user_data)
            conn.execute("COMMIT;")
        except Error as e:
            conn.execute("ROLLBACK;")
            raise e
        finally:
            conn.close()            


# API endpoint to read countries
@app.get("/countries/")
async def read_countries():
    conn = create_connection(DATABASE_PATH)
    if conn:
        cursor = conn.cursor()
        query = "SELECT * FROM Country"
        try:
            cursor.execute(query)
            rows = cursor.fetchall()
            return {"countries": rows}
        except Error as e:
            raise HTTPException(status_code=500, detail=str(e))
        finally:
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Countries: Error connecting to the database")



# API endpoint to read players
@app.get("/players/")
async def read_players():
    conn = create_connection(DATABASE_PATH)
    if conn:
        cursor = conn.cursor()
        query = "SELECT * FROM Player"
        try:
            cursor.execute(query)
            rows = cursor.fetchall()
            return {"players": rows}
        except Error as e:
            raise HTTPException(status_code=500, detail=str(e))
        finally:
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Players: Error connecting to the database")

# API endpoint to read League
@app.get("/leagues/")
async def read_leagues():
    conn = create_connection(DATABASE_PATH)
    if conn:
        cursor = conn.cursor()
        query = "SELECT * FROM League"
        try:
            cursor.execute(query)
            rows = cursor.fetchall()
            return {"leagues": rows}
        except Error as e:
            raise HTTPException(status_code=500, detail=str(e))
        finally:
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Leagues: Error connecting to the database")   

# API endpoint to read Matches
@app.get("/matches/")
async def read_matches():
    conn = create_connection(DATABASE_PATH)
    if conn:
        cursor = conn.cursor()
        query = "SELECT * FROM Match"
        try:
            cursor.execute(query)
            rows = cursor.fetchall()
            return {"matches": rows}
        except Error as e:
            raise HTTPException(status_code=500, detail=str(e))
        finally:
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Matches: Error connecting to the database")     

# API endpoint to read Teams
@app.get("/teams/")
async def read_teams():
    conn = create_connection(DATABASE_PATH)
    if conn:
        cursor = conn.cursor()
        query = "SELECT * FROM Team"
        try:
            cursor.execute(query)
            rows = cursor.fetchall()
            return {"teams": rows}
        except Error as e:
            raise HTTPException(status_code=500, detail=str(e))
        finally:
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Teams: Error connecting to the database")
    
# API endpoint to read Users
@app.get("/users/")
async def read_teams():
    conn = create_connection(DATABASE_PATH)
    if conn:
        cursor = conn.cursor()
        query = "SELECT * FROM User"
        try:
            cursor.execute(query)
            rows = cursor.fetchall()
            return {"users": rows}
        except Error as e:
            raise HTTPException(status_code=500, detail=str(e))
        finally:
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Users: Error connecting to the database")    
    
@app.get("/userdata/{user_id}")
async def get_user_data(user_id: int):
    conn = create_connection(DATABASE_PATH)
    if conn:
        cursor = conn.cursor()
        try:
            # Fetch favorite team and player
            cursor.execute("""
                SELECT 
                    u.User_Id,
                    t.team_long_name,
                    p.player_name,
                    ta.buildUpPlaySpeed,
                    ta.buildUpPlayPassing,
                    ta.chanceCreationPassing,
                    ta.defencePressure,
                    ta.defenceAggression,
                    ta.defenceTeamWidth,
                    pa.overall_rating,
                    pa.finishing,
                    pa.dribbling,
                    pa.passing,
                    pa.sprint_speed,
                    pa.strength,
                    pa.gk_diving,
                    pa.gk_reflexes
                FROM 
                    User u
                LEFT JOIN 
                    Team t ON u.Favorite_Team_API_ID = t.team_api_id
                LEFT JOIN 
                    Team_Attributes ta ON t.team_api_id = ta.team_api_id
                LEFT JOIN 
                    Player p ON u.Favorite_Player_API_ID = p.player_api_id
                LEFT JOIN 
                    Player_Attributes pa ON p.player_api_id = pa.player_api_id
                WHERE 
                    u.User_Id = ? """, (user_id,))
            row = cursor.fetchone()

            if row:
                # Unpack the row into individual variables
                (
                    user_id, team_name,player_name,
                    buildUpPlaySpeed, buildUpPlayPassing, chanceCreationPassing, 
                    defencePressure, defenceAggression, defenceTeamWidth,
                    overall_rating, finishing, dribbling, passing,
                    sprint_speed, strength, gk_diving, gk_reflexes
                ) = row

                # Construct the favorite team attributes dictionary
                favorite_team_attributes = {
                    "buildUpPlaySpeed": buildUpPlaySpeed,
                    "buildUpPlayPassing": buildUpPlayPassing,
                    "chanceCreationPassing": chanceCreationPassing,
                    "defencePressure": defencePressure,
                    "defenceAggression": defenceAggression,
                    "defenceTeamWidth": defenceTeamWidth
                }

                # Construct the favorite player attributes dictionary
                favorite_player_attributes = {
                    "overall_rating": overall_rating,
                    "finishing": finishing,
                    "dribbling": dribbling,
                    "passing": passing,
                    "sprint_speed": sprint_speed,
                    "strength": strength,
                    "gk_diving": gk_diving,
                    "gk_reflexes": gk_reflexes
                }

                # Construct the final data structure
                user_data = {
                    "user_id": user_id,
                    "favorite_team": team_name,
                    "favorite_team_attributes": favorite_team_attributes,
                    "favorite_player": player_name,
                    "favorite_player_attributes": favorite_player_attributes
                }
            else:
                user_data = None  # or handle as appropriate if no data is found

            return UserData(
                user_id = user_id,
                favorite_team=team_name,
                favorite_team_attributes=favorite_team_attributes,
                favorite_player=player_name,
                favorite_player_attributes=favorite_player_attributes
            )
        except Error as e:
            raise HTTPException(status_code=500, detail=str(e))
        finally:
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Error connecting to the database")    

@app.get("/player_attributes/")
async def read_player_attributes():
    conn = create_connection(DATABASE_PATH)
    if conn:
        cursor = conn.cursor()
        query = "SELECT * FROM Player_Attributes"
        try:
            cursor.execute(query)
            rows = cursor.fetchall()
            return {"player_attributes": rows}
        except Error as e:
            raise HTTPException(status_code=500, detail=str(e))
        finally:
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Player_Attributes: Error connecting to the database")

@app.get("/team_attributes/")
async def read_team_attributes():
    conn = create_connection(DATABASE_PATH)
    if conn:
        cursor = conn.cursor()
        query = "SELECT * FROM Team_Attributes"
        try:
            cursor.execute(query)
            rows = cursor.fetchall()
            return {"team_attributes": rows}
        except Error as e:
            raise HTTPException(status_code=500, detail=str(e))
        finally:
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Team_Attributes: Error connecting to the database")



@app.get("/player_attributes/{player_api_id}")
async def read_player_attributes(player_api_id: int):
    conn = create_connection(DATABASE_PATH)
    if conn:
        cursor = conn.cursor()
        query = "SELECT * FROM Player_Attributes WHERE player_api_id = ?"
        try:
            cursor.execute(query, (player_api_id,))
            rows = cursor.fetchall()
            return {"player_attributes": rows}
        except Error as e:
            raise HTTPException(status_code=500, detail=str(e))
        finally:
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Error connecting to the database")
    
@app.put("/update_player/{player_api_id}")
async def api_update_player(player_api_id: int, player_data: PlayerUpdate):
    try:
        update_player(player_data, player_api_id)
        return {"status": "Player updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint to add a player
@app.post("/add_player/")
async def api_add_player(player_data: dict = Body(...)):
    try:
        add_player((player_data["player_api_id"], player_data["player_name"], player_data["player_fifa_api_id"], player_data["birthday"], player_data["height"], player_data["weight"]))
        return {"status": "Player added successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/add_player_attributes/{player_api_id}")
async def api_add_player_attributes(player_api_id: int, attributes: PlayerAttributes):
    try:
        add_player_attributes(player_api_id, attributes.dict())
        return {"status": "Player attributes added successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Endpoint to remove a player
@app.delete("/remove_player/{player_id}")
async def api_remove_player(player_id: int):
    try:
        remove_player(player_id)
        return {"status": "Player removed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint to add a team
@app.post("/add_team/")
async def api_add_team(team_data: dict = Body(...)):
    try:
        add_team((team_data["team_api_id"], team_data["team_fifa_api_id"], team_data["team_long_name"], team_data["team_short_name"]))
        return {"status": "Team added successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

# Endpoint to add a match
@app.post("/add_match/")
async def api_add_match(match_data: dict = Body(...)):
    try:
        add_match((match_data["country_id"],match_data["league_id"],match_data["season"],match_data["stage"], match_data["match_api_id"],match_data["date"], match_data["match_api_id"], match_data["home_team_api_id"],match_data["home_team_goal"],match_data["away_team_goal"],))
        return {"status": "Match added successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    
    
# Endpoint to add a user
@app.post("/add_user/")
async def api_add_user(user_data: dict = Body(...)):
    try:
        add_user((user_data["User_Id"], user_data["Password"],user_data["Favorite_Team_API_ID"],user_data["Favorite_Player_API_ID"]))
        return {"status": "User added successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 


@app.get("/top_player/")
async def read_top_player():
    conn = create_connection(DATABASE_PATH)
    if conn:
        cursor = conn.cursor()
        query = """
            SELECT Player.*, Player_Attributes.*
            FROM Player
            INNER JOIN Player_Attributes ON Player.player_api_id = Player_Attributes.player_api_id
            ORDER BY Player_Attributes.overall_rating DESC
            LIMIT 1
        """
        try:
            cursor.execute(query)
            row = cursor.fetchone()
            return {"top_player": row}
        except Error as e:
            raise HTTPException(status_code=500, detail=str(e))
        finally:
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Error connecting to the database")


@app.get("/recent_match/")
async def read_top_player():
    conn = create_connection(DATABASE_PATH)
    if conn:
        cursor = conn.cursor()
        query = """
            SELECT Match.*
            FROM Match
            ORDER BY Match.date DESC
            LIMIT 1
        """
        try:
            cursor.execute(query)
            row = cursor.fetchone()
            return {"recent_match": row}
        except Error as e:
            raise HTTPException(status_code=500, detail=str(e))
        finally:
            conn.close()
    else:
        raise HTTPException(status_code=500, detail="Error connecting to the database")


# Run the app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
