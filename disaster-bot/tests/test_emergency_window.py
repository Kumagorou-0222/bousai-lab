import os
import sqlite3
import sys
import tempfile
import unittest
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from posters.emergency_window import emergency_x_hours
from storage import state


class EmergencyWindowTest(unittest.TestCase):
    def test_jst_boundaries(self):
        self.assertFalse(emergency_x_hours(datetime(2026, 10, 12, 22, 59, tzinfo=timezone.utc)))
        self.assertTrue(emergency_x_hours(datetime(2026, 10, 12, 23, 0, tzinfo=timezone.utc)))
        self.assertTrue(emergency_x_hours(datetime(2026, 10, 13, 12, 59, tzinfo=timezone.utc)))
        self.assertFalse(emergency_x_hours(datetime(2026, 10, 13, 13, 0, tzinfo=timezone.utc)))

    def test_old_pending_is_not_replayed(self):
        with tempfile.TemporaryDirectory() as directory:
            old_path = state.DB_PATH
            state.DB_PATH = os.path.join(directory, 'state.db')
            try:
                state.init_db()
                conn = sqlite3.connect(state.DB_PATH)
                conn.execute("INSERT INTO pending_posts(post_text, created_at) VALUES ('古い通知', '2026-10-12 12:00:00')")
                conn.execute("INSERT INTO pending_posts(post_text, entry_id, created_at) VALUES ('最新通知', 'jma-latest', '2026-10-13 01:00:00')")
                conn.commit()
                conn.close()
                now = datetime(2026, 10, 13, 3, 0, tzinfo=timezone.utc)
                self.assertEqual(len(state.get_pending_posts(now)), 1)
                self.assertEqual(state.get_pending_posts(now)[0][1], '最新通知')
            finally:
                state.DB_PATH = old_path


if __name__ == '__main__':
    unittest.main()
