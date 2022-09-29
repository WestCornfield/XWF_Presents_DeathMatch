import discord
from discord.ext import commands, tasks
from itertools import cycle

from flask import Flask
from threading import Thread

app = Flask('')

@app.route('/')
def main():
  return "Your Bot Is Ready"

def run():
  try:
    app.run(host="0.0.0.0", port=8000)
  except discord.errors.HTTPException:
    print("\n\n\nBLOCKED BY RATE LIMITS\nRESTARTING NOW\n\n\n")
    system("python restarter.py")
    system('kill 1')

def keep_alive():
  server = Thread(target=run)
  server.start()

bot = commands.Bot(command_prefix = "py!")
status = cycle(['with Python','JetHub'])

@bot.event
async def on_ready():
  change_status.start()
  print("Your bot is ready")

@tasks.loop(seconds=10)
async def change_status():
  await bot.change_presence(activity=discord.Game(next(status)))
