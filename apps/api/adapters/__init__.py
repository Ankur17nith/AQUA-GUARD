import logging
from apps.api.core.config import settings
from apps.api.adapters.base import CanonicalDataInterface
from apps.api.adapters.conduit_prod import ProductionConduitAdapter
from apps.api.adapters.conduit_demo import DemoConduitAdapter

logger = logging.getLogger(__name__)

_adapter_instance: CanonicalDataInterface = None

def get_conduit_adapter() -> CanonicalDataInterface:
    global _adapter_instance
    if _adapter_instance is None:
        if settings.AQUAGUARD_MODE.upper() == "LIVE":
            logger.info("Initializing ProductionConduitAdapter (LIVE mode)")
            _adapter_instance = ProductionConduitAdapter()
        else:
            logger.info("Initializing DemoConduitAdapter (DEMO mode with authentic JKUAT data)")
            _adapter_instance = DemoConduitAdapter()
    return _adapter_instance

def set_adapter_mode(mode: str) -> CanonicalDataInterface:
    global _adapter_instance
    settings.AQUAGUARD_MODE = mode.upper()
    _adapter_instance = None
    return get_conduit_adapter()
