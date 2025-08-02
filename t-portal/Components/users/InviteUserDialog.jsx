import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail, UserPlus, Loader2, Copy, Check } from "lucide-react";
import { SendEmail } from "@/integrations/Core";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function InviteUserDialog({ isOpen, onClose, onInviteSent }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    role: "user",
    fullName: "",
    subject: "",
    gradeLevel: "",
    message: ""
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
    setSuccess(false);
  };

  const generateInviteLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/Dashboard`;
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleSendInvite = async () => {
    if (!formData.email || !formData.fullName) {
      setError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const link = generateInviteLink();
      setInviteLink(link);
      
      const roleTitle = formData.role === 'admin' ? 'Teacher' : 'Student';
      
      const emailBody = `Hello ${formData.fullName},

You've been invited to join EduBase as a ${roleTitle}!

${formData.message ? `\nPersonal message:\n${formData.message}\n` : ''}

To get started:
1. Click this link: ${link}
2. Sign in with your Google account
3. Complete your profile setup

${formData.subject ? `Subject: ${formData.subject}\n` : ''}${formData.gradeLevel ? `Grade Level: ${formData.gradeLevel}\n` : ''}

Welcome to EduBase!

Best regards,
The EduBase Team`;

      await SendEmail({
        to: formData.email,
        subject: `Welcome to EduBase - ${roleTitle} Invitation`,
        body: emailBody
      });

      setSuccess(true);

    } catch (error) {
      console.error("Error sending invite:", error);
      // Show the invite link even if email fails
      const link = generateInviteLink();
      setInviteLink(link);
      setError("Email failed to send, but you can copy the invite link below and share it manually.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (success) {
      onInviteSent?.();
    }
    onClose();
    setFormData({
      email: "",
      role: "user",
      fullName: "",
      subject: "",
      gradeLevel: "",
      message: ""
    });
    setSuccess(false);
    setError(null);
    setInviteLink("");
    setCopied(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <UserPlus className="w-5 h-5 text-blue-600" />
            Invite New User
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">
                Invitation sent successfully! 🎉
              </AlertDescription>
            </Alert>
          )}

          {inviteLink && (
            <Alert className="border-blue-200 bg-blue-50">
              <AlertDescription>
                <div className="space-y-2">
                  <p className="text-blue-800 font-medium">Invite Link:</p>
                  <div className="flex items-center gap-2 p-2 bg-white rounded border">
                    <Input
                      value={inviteLink}
                      readOnly
                      className="text-sm border-0 bg-transparent p-0"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(inviteLink)}
                      className="shrink-0"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-blue-700 text-xs">
                    Share this link with the user to give them access to EduBase
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Enter full name"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="user@example.com"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleInputChange('role', value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">Student</SelectItem>
                <SelectItem value="admin">Teacher</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                placeholder="e.g. Mathematics"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gradeLevel">Grade Level</Label>
              <Input
                id="gradeLevel"
                value={formData.gradeLevel}
                onChange={(e) => handleInputChange('gradeLevel', e.target.value)}
                placeholder="e.g. Grade 10"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Personal Message (Optional)</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Add a welcome message..."
              className="h-20"
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              {success || inviteLink ? 'Done' : 'Cancel'}
            </Button>
            {!success && !inviteLink && (
              <Button
                onClick={handleSendInvite}
                disabled={isLoading || !formData.email || !formData.fullName}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Invitation
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}