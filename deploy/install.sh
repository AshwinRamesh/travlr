# Install script for ubuntu

sudo apt update;
sudo apt install python3-venv python3-dev libpq-dev nginx curl; # TODO - need to auto say "yes"

# TODO - enable pg when using it.
# sudo apt install postgresql postgresql-contrib;

# At this point, the code should be in /root/travlr
cd travlr || exit # TODO - add failure command
python3 -m venv VENV # TODO - probably install all of this outside of the rysnc folder so that we don't need to reinstall it all.
source VENV/bin/activate
pip install -r requirements.txt
pip install gunicorn # Only for deployed server.

# TODO - handle static/build files later. (Currently handling on local machine)

# TODO - move the DB outside of this folder too.