# Latitude, Longitude, and Timezone helper script
# This helper module converts a zipcode to latitude and logitude fully offline
# It also returns the timezone of the location

import pgeocode
from timezonefinder import timezone_at, unique_timezone_at,timezone_at_land

def get_latitude_longtude_timezone(zipcode: str, country: str = "us") -> dict[str,any] | None:
    data = {
        "latitude": None,
        "longitude": None,
        "city": None,
        "state_code": None,
        "timezone": None,
    }

    # Convert zipcode to latitude and longitude
    nomi = pgeocode.Nominatim(country)
    results = nomi.query_postal_code(zipcode)

    if results.empty:
        raise Exception (f"Zipcode {zipcode} not found. Could not get latitude, longitude, and timezone.")

    data["latitude"] = results.latitude.item() 
    data["longitude"] = results.longitude.item() 
    data["city"] = results.place_name 
    data["state_code"]= results.state_code

    # Get timezone of the location
    timezone = timezone_at_land(lng=data["longitude"], lat=data["latitude"])

    if not timezone:
        raise Exception (f"Could not get timezone for location with latitude {data['latitude']} and longitude {data['longitude']}.")
    
    data["timezone"] = timezone
    return(data)
