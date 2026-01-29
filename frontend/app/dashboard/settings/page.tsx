'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { userService } from '@/services/user-service';

export default function SettingsPage() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', newPassword: '', confirmPassword: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userInfo = await userService.getCurrentUser();
        if (userInfo) {
          setUser({
            name: userInfo.name,
            email: userInfo.email
          });
          setFormData({
            name: userInfo.name,
            email: userInfo.email,
            newPassword: '',
            confirmPassword: ''
          });
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      // Check if password fields are filled
      if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        alert('New password and confirmation do not match.');
        return;
      }

      // Update user profile using the service
      await userService.updateUserProfile(formData.name, formData.email);

      // Update local state
      setUser({
        name: formData.name,
        email: formData.email
      });

      // If password is being updated, we need to call the auth API
      if (formData.newPassword) {
        // In a real application, this would call an API endpoint to update the password
        // For now, we'll just show a message since the backend doesn't have a direct password update endpoint
        alert('Password update would be sent to the server in a real application.');
      }

      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        newPassword: '',
        confirmPassword: ''
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-2 text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="grid gap-6">
        {/* Profile Card */}
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 border-b">
            <h2 className="text-xl font-semibold">Profile Information</h2>
            <p className="text-sm text-muted-foreground mt-1">Update your personal details</p>
          </div>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/20 flex items-center justify-center text-2xl font-bold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <button className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs hover:opacity-90 transition-opacity">
                  ✏️
                </button>
              </div>
              <div>
                <h3 className="font-semibold text-lg">{user?.name}</h3>
                <p className="text-muted-foreground text-sm">{user?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {isEditing && (
                <>
                  <div className="space-y-2">
                    <label htmlFor="newPassword" className="text-sm font-medium">New Password</label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      placeholder="Leave blank to keep current password"
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm New Password</label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Re-enter new password"
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-primary hover:bg-primary/90 transition-colors"
                >
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="border-input hover:bg-accent transition-colors"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="bg-primary hover:bg-primary/90 transition-colors"
                  >
                    Save Changes
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
          <div className="bg-gradient-to-r from-secondary/10 to-primary/10 p-6 border-b">
            <h2 className="text-xl font-semibold">Appearance</h2>
            <p className="text-sm text-muted-foreground mt-1">Customize the look and feel</p>
          </div>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Theme</label>
              <div className="flex space-x-3">
                <button className="flex-1 p-3 border-2 border-primary rounded-lg bg-primary/10 text-primary font-medium">
                  Light
                </button>
                <button className="flex-1 p-3 border rounded-lg hover:bg-accent transition-colors">
                  Dark
                </button>
                <button className="flex-1 p-3 border rounded-lg hover:bg-accent transition-colors">
                  System
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Language</label>
              <select className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary">
                <option>English</option>
                <option>Español</option>
                <option>Français</option>
                <option>Deutsch</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}