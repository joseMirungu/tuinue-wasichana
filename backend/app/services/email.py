import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

def send_email(to_email, subject, html_content):
    """Send an email using SendGrid."""
    try:
        sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        message = Mail(
            from_email='noreply@tuinuewasichana.org',
            to_emails=to_email,
            subject=subject,
            html_content=html_content
        )
        response = sg.send(message)
        return response.status_code == 202
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return False

def send_donation_confirmation(to_email, amount, charity_name):
    """Send donation confirmation email."""
    subject = "Thank you for your donation!"
    html_content = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Thank you for your donation!</h2>
        <p>We're grateful for your generous donation of ${amount} to {charity_name}.</p>
        <p>Your support helps provide essential supplies to girls in need.</p>
        <p>You can track the impact of your donation in your donor dashboard.</p>
        <br>
        <p>Best regards,</p>
        <p>Tuinue Wasichana Team</p>
    </div>
    """
    return send_email(to_email, subject, html_content)

def send_welcome_email(to_email, user_type):
    """Send welcome email to new users."""
    subject = "Welcome to Tuinue Wasichana!"
    html_content = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to Tuinue Wasichana!</h2>
        <p>Thank you for joining our platform as a {user_type}.</p>
        <p>Together, we can make a difference in girls' education.</p>
        <br>
        <p>Best regards,</p>
        <p>Tuinue Wasichana Team</p>
    </div>
    """
    return send_email(to_email, subject, html_content)

def send_monthly_donation_reminder(to_email, amount, charity_name, payment_date):
    """Send monthly donation reminder."""
    subject = "Monthly Donation Reminder"
    html_content = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Monthly Donation Reminder</h2>
        <p>Your monthly donation of ${amount} to {charity_name} is scheduled for {payment_date}.</p>
        <p>Thank you for your continued support!</p>
        <br>
        <p>Best regards,</p>
        <p>Tuinue Wasichana Team</p>
    </div>
    """
    return send_email(to_email, subject, html_content)