#!/usr/bin/env python3
"""
Enterprise Database Service
Provides database connection and query utilities for the Legion Enterprise system.
"""

import sqlite3
import json
from datetime import datetime, date
from typing import List, Dict, Any, Optional
import os

class EnterpriseDatabase:
    """Database service for Legion Enterprise operations."""
    
    def __init__(self, db_path: str = None):
        """Initialize database connection."""
        if db_path is None:
            # Default to the enterprise operations database
            current_dir = os.path.dirname(os.path.abspath(__file__))
            db_path = os.path.join(current_dir, 'data', 'enterprise_operations.db')
        
        self.db_path = db_path
        self.connection = None
    
    def connect(self):
        """Establish database connection."""
        try:
            self.connection = sqlite3.connect(self.db_path)
            self.connection.row_factory = sqlite3.Row  # Enable column access by name
            return True
        except sqlite3.Error as e:
            print(f"Database connection error: {e}")
            return False
    
    def disconnect(self):
        """Close database connection."""
        if self.connection:
            self.connection.close()
            self.connection = None
    
    def execute_query(self, query: str, params: tuple = ()) -> List[Dict[str, Any]]:
        """Execute a SELECT query and return results as list of dictionaries."""
        if not self.connection:
            self.connect()
        
        try:
            cursor = self.connection.cursor()
            cursor.execute(query, params)
            rows = cursor.fetchall()
            
            # Convert sqlite3.Row objects to dictionaries
            result = []
            for row in rows:
                result.append(dict(row))
            
            return result
        except sqlite3.Error as e:
            print(f"Query execution error: {e}")
            return []
    
    def execute_update(self, query: str, params: tuple = ()) -> bool:
        """Execute an INSERT, UPDATE, or DELETE query."""
        if not self.connection:
            self.connect()
        
        try:
            cursor = self.connection.cursor()
            cursor.execute(query, params)
            self.connection.commit()
            return True
        except sqlite3.Error as e:
            print(f"Update execution error: {e}")
            return False

class BusinessObjectivesService:
    """Service for business objectives operations."""
    
    def __init__(self, db: EnterpriseDatabase):
        self.db = db
    
    def get_all_objectives(self) -> List[Dict[str, Any]]:
        """Get all business objectives grouped by type."""
        query = """
        SELECT objective_type, description, target_value, current_value, 
               target_date, status, created_at
        FROM business_objectives 
        GROUP BY objective_type 
        ORDER BY target_date ASC
        """
        return self.db.execute_query(query)
    
    def get_objectives_progress(self) -> Dict[str, float]:
        """Calculate progress percentage for each objective."""
        objectives = self.get_all_objectives()
        progress = {}
        
        for obj in objectives:
            if obj['target_value'] > 0:
                progress[obj['objective_type']] = (obj['current_value'] / obj['target_value']) * 100
            else:
                progress[obj['objective_type']] = 0.0
        
        return progress
    
    def get_upcoming_deadlines(self, days_ahead: int = 30) -> List[Dict[str, Any]]:
        """Get objectives with deadlines in the next N days."""
        query = """
        SELECT objective_type, description, target_date, status
        FROM business_objectives 
        WHERE target_date <= date('now', '+{} days')
        AND status = 'active'
        GROUP BY objective_type
        ORDER BY target_date ASC
        """.format(days_ahead)
        
        return self.db.execute_query(query)

class DepartmentActivitiesService:
    """Service for department activities operations."""
    
    def __init__(self, db: EnterpriseDatabase):
        self.db = db
    
    def get_all_activities(self) -> List[Dict[str, Any]]:
        """Get all department activities grouped by department."""
        query = """
        SELECT department, activity_type, description, status, priority, created_at
        FROM department_activities 
        GROUP BY department, activity_type
        ORDER BY priority DESC, department
        """
        return self.db.execute_query(query)
    
    def get_department_summary(self) -> Dict[str, Dict[str, Any]]:
        """Get summary statistics by department."""
        activities = self.get_all_activities()
        summary = {}
        
        for activity in activities:
            dept = activity['department']
            if dept not in summary:
                summary[dept] = {
                    'total_activities': 0,
                    'active_activities': 0,
                    'avg_priority': 0,
                    'activities': []
                }
            
            summary[dept]['total_activities'] += 1
            if activity['status'] == 'active':
                summary[dept]['active_activities'] += 1
            summary[dept]['activities'].append(activity)
        
        # Calculate average priority
        for dept in summary:
            if summary[dept]['activities']:
                priorities = [act['priority'] for act in summary[dept]['activities']]
                summary[dept]['avg_priority'] = sum(priorities) / len(priorities)
        
        return summary

class RevenueTrackingService:
    """Service for revenue tracking operations."""
    
    def __init__(self, db: EnterpriseDatabase):
        self.db = db
    
    def get_revenue_data(self) -> List[Dict[str, Any]]:
        """Get all revenue tracking data ordered by date."""
        query = """
        SELECT month, year, target_revenue, actual_revenue, lead_value, conversion_rate, created_at
        FROM revenue_tracking 
        GROUP BY month, year
        ORDER BY year, month
        """
        return self.db.execute_query(query)
    
    def get_current_year_summary(self, year: int = None) -> Dict[str, float]:
        """Get revenue summary for current or specified year."""
        if year is None:
            year = datetime.now().year
        
        query = """
        SELECT 
            SUM(target_revenue) as total_target,
            SUM(actual_revenue) as total_actual,
            SUM(lead_value) as total_leads,
            AVG(conversion_rate) as avg_conversion
        FROM revenue_tracking 
        WHERE year = ?
        """
        
        result = self.db.execute_query(query, (year,))
        if result:
            return result[0]
        return {'total_target': 0, 'total_actual': 0, 'total_leads': 0, 'avg_conversion': 0}
    
    def get_monthly_performance(self, year: int = None) -> List[Dict[str, Any]]:
        """Get month-by-month performance data."""
        if year is None:
            year = datetime.now().year
        
        query = """
        SELECT month, target_revenue, actual_revenue, lead_value, conversion_rate
        FROM revenue_tracking 
        WHERE year = ?
        ORDER BY month
        """
        
        return self.db.execute_query(query, (year,))

class EnterpriseDataAPI:
    """Main API service for dashboard data."""
    
    def __init__(self, db_path: str = None):
        self.db = EnterpriseDatabase(db_path)
        self.objectives_service = BusinessObjectivesService(self.db)
        self.activities_service = DepartmentActivitiesService(self.db)
        self.revenue_service = RevenueTrackingService(self.db)
    
    def get_dashboard_data(self) -> Dict[str, Any]:
        """Get complete dashboard data payload."""
        try:
            # Connect to database
            if not self.db.connect():
                return {"error": "Database connection failed"}
            
            # Gather all dashboard data
            dashboard_data = {
                "timestamp": datetime.now().isoformat(),
                "business_objectives": {
                    "objectives": self.objectives_service.get_all_objectives(),
                    "progress": self.objectives_service.get_objectives_progress(),
                    "upcoming_deadlines": self.objectives_service.get_upcoming_deadlines()
                },
                "department_activities": {
                    "activities": self.activities_service.get_all_activities(),
                    "summary": self.activities_service.get_department_summary()
                },
                "revenue_tracking": {
                    "data": self.revenue_service.get_revenue_data(),
                    "current_year": self.revenue_service.get_current_year_summary(),
                    "monthly_performance": self.revenue_service.get_monthly_performance()
                }
            }
            
            return dashboard_data
            
        except Exception as e:
            return {"error": f"Data retrieval error: {str(e)}"}
        
        finally:
            self.db.disconnect()

def main():
    """Test the database services."""
    print("🔧 Testing Enterprise Database Services...")
    
    # Initialize API
    api = EnterpriseDataAPI()
    
    # Get dashboard data
    data = api.get_dashboard_data()
    
    if "error" in data:
        print(f"❌ Error: {data['error']}")
        return
    
    # Print summary
    print(f"✅ Database connection successful!")
    print(f"📊 Data retrieved at: {data['timestamp']}")
    print(f"🎯 Business Objectives: {len(data['business_objectives']['objectives'])}")
    print(f"🏢 Department Activities: {len(data['department_activities']['activities'])}")
    print(f"💰 Revenue Records: {len(data['revenue_tracking']['data'])}")
    
    # Show sample data
    print("\n📋 Sample Business Objectives:")
    for obj in data['business_objectives']['objectives'][:3]:
        print(f"  • {obj['objective_type']}: {obj['description']}")
    
    print("\n🏢 Active Departments:")
    for dept, info in data['department_activities']['summary'].items():
        print(f"  • {dept}: {info['active_activities']} active activities (Priority: {info['avg_priority']})")

if __name__ == "__main__":
    main()
