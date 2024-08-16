import json

def env_to_list_of_objects(env_file_path):
    list_of_objects = []
    with open(env_file_path, 'r') as f:
        for line in f:
            # Ignore empty lines and comments
            if line.strip() == "" or line.startswith("#"):
                continue

            # Split on the first '=' character
            key, value = line.strip().split('=', 1)
            # Create an object for each key-value pair and append it to the list
            list_of_objects.append({key: value.strip()})

    return list_of_objects

def env_to_json(env_file_path, json_file_path):
    list_of_objects = env_to_list_of_objects(env_file_path)
    
    # Convert the list of objects to a JSON string and save it to a file
    with open(json_file_path, 'w') as json_file:
        json.dump(list_of_objects, json_file, indent=4)

# Example usage:
env_file = '.env'
json_file = 'output_file.json'

env_to_json(env_file, json_file)
