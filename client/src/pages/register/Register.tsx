import React, { useState } from 'react';
import { TextField, Button, Chip, Box, FormControl, FormGroup, InputLabel, OutlinedInput } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const navigate = useNavigate();

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('https://your-server.com/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setImageUrl(data.url);
        } else {
          console.error('Failed to upload image');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const handleAddTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === ' ' && tagInput.trim() !== '') {
      setTags((prevTags) => [...prevTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToDelete));
  };

  const handleSubmit = () => {
    if (!title || !location) {
      alert('Title and Location are required!');
      return;
    }

    const data = {
      imageUrl,
      title,
      location,
      tags,
    };

    navigate('/');
  };

  return (
    <Box sx={{ maxWidth: 500, margin: '0 auto', padding: 2 }}>
      <h1>Register</h1>
      <FormGroup>
        <FormControl margin="normal">
          {imagePreview && (
            <Box
              component="img"
              src={imagePreview}
              alt="Preview"
              sx={{
                width: 300,
                height: 300,
                objectFit: 'cover',
                marginTop: 2,
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            />
          )}
        </FormControl>
        <FormControl margin="normal">
          <Button
            variant="contained"
            component="label"
          >
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>
        </FormControl>

        <FormControl margin="normal">
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </FormControl>

        <FormControl margin="normal">
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormControl>

        <FormControl margin="normal">
          <TextField
            fullWidth
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </FormControl>

        <FormControl margin="normal">
          <TextField
            fullWidth
            label="Tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Type a tag and press space"
          />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginTop: 2 }}>
            {tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                onDelete={() => handleDeleteTag(tag)}
                color="primary"
              />
            ))}
          </Box>
        </FormControl>

        <FormControl margin="normal">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </FormControl>
      </FormGroup>
    </Box>
  );
};

export default Register;