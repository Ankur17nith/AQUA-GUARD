import datetime
from sqlalchemy import Column, Integer, Float, String, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from apps.api.core.database import Base

class StationModel(Base):
    __tablename__ = "stations"

    id = Column(Integer, primary_key=True, index=True)
    site_id = Column(Integer, index=True)
    instrument_id = Column(Integer, index=True)
    name = Column(String(255), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    elevation_meters = Column(Float, default=0.0)
    county = Column(String(100), default="Kiambu")
    project = Column(String(100), default="3D FEWSNET")
    affiliation = Column(String(255), default="NCAR / JKUAT JHUB Africa")
    status = Column(String(50), default="ONLINE")
    last_observation_time = Column(String(50), nullable=True)
    is_primary_conduit = Column(Boolean, default=False)
    metadata_json = Column(JSON, nullable=True)

    observations = relationship("ObservationModel", back_populates="station", cascade="all, delete-orphan")


class ObservationModel(Base):
    __tablename__ = "observations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    station_id = Column(Integer, ForeignKey("stations.id"), index=True, nullable=False)
    timestamp = Column(String(50), index=True, nullable=False)
    
    # Rainfall (mm)
    rainfall_gauge1 = Column(Float, default=0.0)
    rainfall_gauge2 = Column(Float, default=0.0)
    rainfall_total_today = Column(Float, default=0.0)
    rainfall_total_prior = Column(Float, default=0.0)
    
    # Temperatures (°C)
    temperature_bmx = Column(Float, nullable=True)
    temperature_mcp = Column(Float, nullable=True)
    temperature_sht = Column(Float, nullable=True)
    wet_bulb_temp = Column(Float, nullable=True)
    wet_bulb_globe_temp = Column(Float, nullable=True)
    heat_index = Column(Float, nullable=True)
    
    # Pressure & Humidity
    pressure_hpa = Column(Float, nullable=True)
    relative_humidity_pct = Column(Float, nullable=True)
    
    # Solar & Wind
    solar_visible = Column(Float, default=0.0)
    solar_infrared = Column(Float, default=0.0)
    solar_uv = Column(Float, default=0.0)
    wind_speed = Column(Float, default=0.0)
    wind_direction = Column(Float, default=0.0)
    wind_gust = Column(Float, default=0.0)
    
    # Fused & Derived Variables
    soil_moisture_pct = Column(Float, nullable=True)
    vegetation_ndvi = Column(Float, nullable=True)
    evapotranspiration_mm = Column(Float, default=0.0)
    
    # Health & Provenance
    battery_charge_status = Column(Integer, default=3)
    cell_signal_strength = Column(Float, default=100.0)
    source = Column(String(50), default="CONDUIT_3DPAWS")
    status = Column(String(30), default="OBSERVED")
    quality = Column(String(30), default="VALID")
    
    station = relationship("StationModel", back_populates="observations")


class BaselineModel(Base):
    __tablename__ = "historical_baselines"

    id = Column(Integer, primary_key=True, autoincrement=True)
    station_id = Column(Integer, ForeignKey("stations.id"), index=True)
    month = Column(Integer, index=True) # 1-12
    rainfall_mean_mm = Column(Float, default=45.0)
    rainfall_std_mm = Column(Float, default=12.0)
    temperature_mean_c = Column(Float, default=22.5)
    temperature_std_c = Column(Float, default=3.1)
    soil_moisture_mean_pct = Column(Float, default=34.0)
    soil_moisture_std_pct = Column(Float, default=5.5)
    humidity_mean_pct = Column(Float, default=68.0)
    ndvi_mean = Column(Float, default=0.48)


class RiskAssessmentModel(Base):
    __tablename__ = "risk_assessments"

    id = Column(Integer, primary_key=True, autoincrement=True)
    station_id = Column(Integer, ForeignKey("stations.id"), index=True)
    timestamp = Column(String(50), index=True)
    category = Column(String(50), index=True) # DROUGHT, FLOOD, HEAT, WATER_STRESS, VEGETATION_STRESS
    probability_pct = Column(Float, nullable=False)
    severity = Column(String(20), nullable=False) # LOW, MEDIUM, HIGH, CRITICAL
    confidence_pct = Column(Float, default=80.0)
    horizon = Column(String(50), default="7-14 days")
    drivers_json = Column(JSON, nullable=True)
    evidence_json = Column(JSON, nullable=True)
    why_explanation_json = Column(JSON, nullable=True)
    model_version = Column(String(50), default="AQUAGUARD-RISK-v0.3")


class AlertModel(Base):
    __tablename__ = "alerts"

    id = Column(String(100), primary_key=True)
    station_id = Column(Integer, ForeignKey("stations.id"), index=True)
    title = Column(String(255), nullable=False)
    category = Column(String(50), nullable=False)
    severity = Column(String(20), nullable=False)
    detected_at = Column(String(50), nullable=False)
    message = Column(Text, nullable=False)
    recommended_action = Column(Text, nullable=False)
    status = Column(String(30), default="ACTIVE") # ACTIVE, ACKNOWLEDGED, RESOLVED, SNOOZED


class ActionRecommendationModel(Base):
    __tablename__ = "action_recommendations"

    id = Column(String(100), primary_key=True)
    station_id = Column(Integer, ForeignKey("stations.id"), index=True)
    title = Column(String(255), nullable=False)
    urgency = Column(String(50), nullable=False) # IMMEDIATE, NEXT 24 HOURS, NEXT 7 DAYS, MONITOR
    category = Column(String(50), nullable=False)
    reason = Column(Text, nullable=False)
    evidence_json = Column(JSON, nullable=True)
    expected_effect = Column(Text, nullable=False)
    avoided_loss_estimate = Column(String(255), nullable=False)
    confidence = Column(Float, default=0.85)
    target_sector = Column(String(50), default="AGRICULTURE")
    status = Column(String(30), default="PENDING")
