"""
Management command to view contact messages from backup JSON file.
Useful in production when database might not persist.

Usage:
    python manage.py view_contact_messages
    python manage.py view_contact_messages --limit 10
    python manage.py view_contact_messages --export output.json
"""
from django.core.management.base import BaseCommand
from django.conf import settings
import json
import os
from datetime import datetime


class Command(BaseCommand):
    help = 'View contact messages from backup JSON file'

    def add_arguments(self, parser):
        parser.add_argument(
            '--limit',
            type=int,
            default=None,
            help='Limit the number of messages to display'
        )
        parser.add_argument(
            '--export',
            type=str,
            default=None,
            help='Export messages to a JSON file'
        )
        parser.add_argument(
            '--unread-only',
            action='store_true',
            help='Show only messages not marked as read in database'
        )

    def handle(self, *args, **options):
        backup_file = os.path.join(settings.BASE_DIR, 'contact_backups', 'contact_messages.json')
        
        if not os.path.exists(backup_file):
            self.stdout.write(self.style.WARNING('No backup file found. No messages have been submitted yet.'))
            return
        
        try:
            with open(backup_file, 'r', encoding='utf-8') as f:
                messages = json.load(f)
        except (json.JSONDecodeError, IOError) as e:
            self.stdout.write(self.style.ERROR(f'Error reading backup file: {e}'))
            return
        
        if not messages:
            self.stdout.write(self.style.WARNING('Backup file is empty. No messages found.'))
            return
        
        # Sort by timestamp (newest first)
        messages.sort(key=lambda x: x.get('created_at', ''), reverse=True)
        
        # Apply limit if specified
        if options['limit']:
            messages = messages[:options['limit']]
        
        # Export if requested
        if options['export']:
            try:
                with open(options['export'], 'w', encoding='utf-8') as f:
                    json.dump(messages, f, indent=2, ensure_ascii=False)
                self.stdout.write(self.style.SUCCESS(f'Exported {len(messages)} messages to {options["export"]}'))
                return
            except IOError as e:
                self.stdout.write(self.style.ERROR(f'Error exporting messages: {e}'))
                return
        
        # Display messages
        self.stdout.write(self.style.SUCCESS(f'\nFound {len(messages)} contact messages:\n'))
        self.stdout.write('=' * 80)
        
        for i, msg in enumerate(messages, 1):
            self.stdout.write(f'\n{self.style.HTTP_INFO(f"Message #{i}")}')
            self.stdout.write('-' * 80)
            self.stdout.write(f'{self.style.WARNING("Name:")} {msg.get("name", "N/A")}')
            self.stdout.write(f'{self.style.WARNING("Email:")} {msg.get("email", "N/A")}')
            self.stdout.write(f'{self.style.WARNING("Phone:")} {msg.get("phone_number", "N/A")}')
            self.stdout.write(f'{self.style.WARNING("Submitted:")} {msg.get("created_at", "N/A")}')
            self.stdout.write(f'{self.style.WARNING("DB Saved:")} {"Yes" if msg.get("db_saved") else "No"}')
            self.stdout.write(f'\n{self.style.WARNING("Message:")}')
            self.stdout.write(msg.get("message", "N/A"))
            self.stdout.write('=' * 80)
        
        self.stdout.write(f'\n{self.style.SUCCESS(f"Total messages displayed: {len(messages)}")}')
        self.stdout.write(f'{self.style.NOTICE(f"Backup file location: {backup_file}")}')
