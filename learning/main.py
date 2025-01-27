import os
import json
import shutil

# Specify the folder where your HTML files are located
html_folder = './input/html'
# Specify the path to your metadata JSON file
metadata_file = './input/metadata.json'
# Specify the path for the output folder and index.html file
output_folder = './output'
output_file = os.path.join(output_folder, 'index.html')

# Ensure the output folder exists, if not, create it
if not os.path.exists(output_folder):
    os.makedirs(output_folder)

# Clear the output folder before generating the new files
for filename in os.listdir(output_folder):
    file_path = os.path.join(output_folder, filename)
    if os.path.isfile(file_path) or os.path.islink(file_path):
        os.unlink(file_path)
    elif os.path.isdir(file_path):
        shutil.rmtree(file_path)

# Load the metadata JSON file
if os.path.exists(metadata_file):
    with open(metadata_file, 'r', encoding='utf-8') as f:
        metadata = json.load(f)
else:
    metadata = []

# Convert metadata list to a dictionary for faster lookup
metadata_dict = {item['fileName']: item for item in metadata}

# Get the list of HTML files in the input folder
html_files = [file for file in os.listdir(html_folder) if file.endswith('.html')]
html_files.sort()

# Copy HTML files from the input folder to the output folder
for html_file in html_files:
    shutil.copy(os.path.join(html_folder, html_file), output_folder)

# Create the index.html file in the output folder
with open(output_file, 'w', encoding='utf-8') as f:
    # Start HTML structure
    f.write('<!DOCTYPE html>\n')
    f.write('<html lang="en">\n')
    f.write('<head>\n')
    f.write('<meta charset="UTF-8">\n')
    f.write('<meta name="viewport" content="width=device-width, initial-scale=1.0">\n')
    f.write('<title>HTML File Index</title>\n')
    f.write('<style>\n')
    f.write('table { width: 100%; border-collapse: collapse; }\n')
    f.write('th, td { border: 1px solid #dddddd; padding: 8px; text-align: left; }\n')
    f.write('th { background-color: #f2f2f2; }\n')
    f.write('</style>\n')
    f.write('</head>\n')
    f.write('<body>\n')
    f.write('<h1>HTML File Index</h1>\n')
    f.write('<table>\n')
    f.write('<tr>\n')
    f.write('<th>File Name</th>\n')
    f.write('<th>Date Created</th>\n')
    f.write('<th>Tags</th>\n')
    f.write('<th>Blog Title</th>\n')
    f.write('<th>Blog Description</th>\n')
    f.write('</tr>\n')

    # Populate the table with rows for each HTML file
    for html_file in html_files:
        file_metadata = metadata_dict.get(html_file, {})
        date_created = file_metadata.get('dateCreated', 'N/A')
        tags = ', '.join(file_metadata.get('tags', [])) if 'tags' in file_metadata else 'N/A'
        blog_title = file_metadata.get('blogTitle', 'N/A')
        blog_description = file_metadata.get('blogDescription', 'N/A')

        # Create table row
        f.write('<tr>\n')
        # Updated <a> tag to point to the copied HTML files in the output folder
        f.write(f'<td><a href="{html_file}">{html_file}</a></td>\n')
        f.write(f'<td>{date_created}</td>\n')
        f.write(f'<td>{tags}</td>\n')
        f.write(f'<td>{blog_title}</td>\n')
        f.write(f'<td>{blog_description}</td>\n')
        f.write('</tr>\n')

    # End HTML structure
    f.write('</table>\n')
    f.write('</body>\n')
    f.write('</html>\n')

print(f'index.html has been created at: {output_file}')
