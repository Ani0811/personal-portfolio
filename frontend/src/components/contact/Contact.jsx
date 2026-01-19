import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { SectionHeader, Input, Textarea, Button } from '../common';

export function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [submitState, setSubmitState] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({ email: '', phone: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitState('loading');
    setErrorMessage('');

    try {
      // Prefer production-specific API URL if provided, then generic VITE_API_URL, then localhost
      const apiUrl = import.meta.env.VITE_API_URL_PROD || import.meta.env.VITE_API_URL_DEV || 'http://localhost:8000';
      const payload = {
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone || '',
        message: formData.message,
      };

      const response = await fetch(`${apiUrl}/api/contact/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      setSubmitState('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
      
      // Reset to idle after 5 seconds
      setTimeout(() => {
        setSubmitState('idle');
      }, 5000);
    } catch (error) {
      console.error('Contact form submission error:', error);
      setSubmitState('error');
      setErrorMessage(error.message || 'Failed to send message. Please try again.');
      
      // Reset to idle after 5 seconds
      setTimeout(() => {
        setSubmitState('idle');
        setErrorMessage('');
      }, 5000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = { ...formData, [name]: value };
    setFormData(next);

    // Validate as user types
    if (name === 'email') {
      if (!validateEmail(value)) {
        setValidationErrors((s) => ({ ...s, email: 'Please enter a valid email address.' }));
      } else {
        setValidationErrors((s) => ({ ...s, email: '' }));
      }
    }

    if (name === 'phone') {
      // Only validate phone when non-empty
      if (value && !validatePhone(value)) {
        setValidationErrors((s) => ({ ...s, phone: 'Please enter a valid phone number (7–15 digits).' }));
      } else {
        setValidationErrors((s) => ({ ...s, phone: '' }));
      }
    }
  };

  // Simple validators
  const validateEmail = (value) => {
    if (!value) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(value);
  };

  const validatePhone = (value) => {
    const digits = value.replace(/\D/g, '');
    return digits.length >= 7 && digits.length <= 15;
  };

  // Button content based on state
  const getButtonContent = () => {
    switch (submitState) {
      case 'loading':
        return (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending...
          </>
        );
      case 'success':
        return (
          <>
            <CheckCircle className="w-4 h-4" />
            Message Sent!
          </>
        );
      case 'error':
        return (
          <>
            <AlertCircle className="w-4 h-4" />
            Failed - Try Again
          </>
        );
      default:
        return (
          <>
            Send Message
            <Send className="w-4 h-4" />
          </>
        );
    }
  };

  // Button variant based on state
  const getButtonVariant = () => {
    if (submitState === 'success') return 'primary';
    if (submitState === 'error') return 'secondary';
    return 'contact';
  };

  return (
    <section id="contact" ref={ref} className="py-20 lg:py-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="Get In Touch"
          title="Let's Work Together"
          description="Have a project in mind or want to discuss opportunities? Drop me a message and I'll get back to you as soon as possible."
          animate
          isInView={isInView}
        />

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6 h-full flex flex-col justify-start"
          >
            <div>
              <h3 className="text-xl font-semibold mb-4">Connect</h3>
              <p className="text-muted-foreground mb-6">
                I'm always open to discussing new projects, creative ideas, or opportunities.
              </p>
            </div>

            <div className="p-4 border border-border rounded-lg bg-card/40 space-y-4 h-full">
              <a
                href="mailto:anirudha.basuthakur@gmail.com"
                className="flex items-start gap-3 text-muted-foreground hover:text-accent transition-colors group"
              >
                <div className="w-10 h-10 rounded-none border border-border bg-accent/10 text-accent flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <svg className="w-5 h-5 block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <rect x="3" y="5" width="18" height="14" rx="2" ry="2"></rect>
                    <polyline points="3 7 12 13 21 7"></polyline>
                  </svg>
                </div>
                <span className="wrap-break-word max-w-48 leading-snug">
                  <span className="inline-block">anirudha.basuthakur</span>
                  <br />
                  <span className="inline-block text-sm text-muted-foreground/90">@gmail.com</span>
                </span>
              </a>
              
              <a
                href="tel:+919875417275"
                className="flex items-center gap-3 text-muted-foreground hover:text-accent transition-colors group"
              >
                <div className="w-10 h-10 rounded-none border border-border bg-accent/10 text-accent flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <span>+91 9875417275</span>
              </a>
              
              <a
                href="https://www.linkedin.com/in/anirudha-basu-thakur-686aa8253"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted-foreground hover:text-accent transition-colors group"
              >
                <div className="w-10 h-10 rounded-none border border-border bg-accent/10 text-accent flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.036-1.85-3.036-1.851 0-2.134 1.445-2.134 2.939v5.666H9.352V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.369-1.85 3.602 0 4.268 2.37 4.268 5.456v6.285zM5.337 7.433a2.066 2.066 0 11.001-4.131 2.066 2.066 0 01-.001 4.131zM7.119 20.452H3.554V9h3.565v11.452z" />
                  </svg>
                </div>
                <span>LinkedIn Profile</span>
              </a>

              <a
                href="https://instagram.com/this_is_ringo_here"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted-foreground hover:text-accent transition-colors group"
              >
                <div className="w-10 h-10 rounded-none border border-border bg-accent/10 text-accent flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </div>
                <span>Instagram Profile</span>
              </a>  
              
              <a
                href="https://github.com/Ani0811"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted-foreground hover:text-accent transition-colors group"
              >
                <div className="w-10 h-10 rounded-none border border-border bg-accent/10 text-accent flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.809 1.305 3.495.998.108-.775.418-1.305.76-1.605-2.665-.305-5.466-1.332-5.466-5.931 0-1.31.47-2.381 1.235-3.221-.135-.303-.54-1.524.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.874.12 3.176.765.84 1.23 1.911 1.23 3.221 0 4.61-2.805 5.625-5.475 5.921.435.375.825 1.11.825 2.235 0 1.615-.015 2.915-.015 3.31 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12 24 5.37 18.63 0 12 0z" />
                  </svg>
                </div>
                <span>GitHub Profile</span>
              </a>
              
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-10 h-10 rounded-none border border-border bg-accent/10 text-accent flex items-center justify-center">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <span>Kolkata, India</span>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2 relative z-20"
          >
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <div className="grid sm:grid-cols-2 gap-6">
                <Input
                  label="Name"
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="text-left"
                />
                <Input
                  label="Email"
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  aria-invalid={validationErrors.email ? 'true' : 'false'}
                  aria-describedby={validationErrors.email ? 'email-error' : undefined}
                  required
                  placeholder="your@email.com"
                  className="text-left"
                />
                {validationErrors.email && (
                  <motion.p
                    id="email-error"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive mt-1"
                  >
                    {validationErrors.email}
                  </motion.p>
                )}
              </div>

              <Input
                label="Phone"
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                aria-invalid={validationErrors.phone ? 'true' : 'false'}
                aria-describedby={validationErrors.phone ? 'phone-error' : undefined}
                placeholder="+91 00000 - 00000"
                className="text-left"
              />
              {validationErrors.phone && (
                <motion.p
                  id="phone-error"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-destructive mt-1"
                >
                  {validationErrors.phone}
                </motion.p>
              )}

              <Textarea
                label="Message"
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Hi!! Ask me anything..."
                className="text-left"
              />

              <Button
                type="submit"
                variant={getButtonVariant()}
                size="lg"
                className="w-full transition-all duration-300"
                style={
                  submitState === 'success'
                    ? { backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-foreground)' }
                    : submitState === 'error'
                    ? { backgroundColor: 'var(--color-destructive)', color: 'var(--color-destructive-foreground)' }
                    : {}
                }
                disabled={
                  submitState === 'loading' ||
                  submitState === 'success' ||
                  Boolean(validationErrors.email || validationErrors.phone) ||
                  !formData.name.trim() ||
                  !formData.email.trim() ||
                  !formData.message.trim()
                }
                animate
              >
                {getButtonContent()}
              </Button>

              {errorMessage && submitState === 'error' && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-destructive text-center"
                >
                  {errorMessage}
                </motion.p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
