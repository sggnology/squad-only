import React, { useState } from 'react';
import { TextField, Button, Chip, Box, FormControl, FormGroup } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance'; // Import axiosInstance

// Interface for the content registration request body
interface ContentRegistrationReqDto {
  newFileIds: number[];
  title: string;
  description: string;
  location: string;
  tags: string[];
}

function Register() {
  const [uploadedFileId, setUploadedFileId] = useState<number | null>(null);
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
      // 1. Local preview
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);

      // 2. Upload to server
      const formData = new FormData();
      formData.append('files', file);

      try {
        const response = await axiosInstance.post('/file', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data && Array.isArray(response.data) && response.data.length > 0 && typeof response.data[0] === 'number') {
          setUploadedFileId(response.data[0]);
        } else {
          console.error('Failed to upload image or invalid file ID received:', response.data);
          setImagePreview(null);
          setUploadedFileId(null);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        setImagePreview(null);
        setUploadedFileId(null);
      }
    } else {
      setImagePreview(null);
      setUploadedFileId(null);
    }
  };

  const handleAddTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === ' ' && tagInput.trim() !== '') {
      if (!tags.includes(tagInput.trim())) {
        setTags((prevTags) => [...prevTags, tagInput.trim()]);
      }
      setTagInput('');
      event.preventDefault();
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToDelete));
  };

  const handleSubmit = async () => {
    if (!title) {
      alert('Title is required!');
      return;
    }
    if (!location) {
      alert('Location is required!');
      return;
    }

    const payload: ContentRegistrationReqDto = {
      newFileIds: uploadedFileId == null ? [] : [uploadedFileId],
      title,
      description,
      location,
      tags,
    };

    try {
      await axiosInstance.post('/content', payload);
      console.log('Content registered successfully:', payload);
      navigate('/');
    } catch (error) {
      console.error('Error registering content:', error);
    }
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
}

export default Register;