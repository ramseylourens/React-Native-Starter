#!/bin/bash
# Helper script to ensure Android emulator is ready before running the app
# This script waits for the emulator to be fully booted using adb wait-for-device

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}⏳ Waiting for Android device/emulator to be ready...${NC}"

# Wait for device to be connected
adb wait-for-device

echo -e "${GREEN}✓ Device connected${NC}"

# Wait for device to finish booting (check boot_completed property)
echo -e "${YELLOW}⏳ Waiting for device to finish booting...${NC}"

while true; do
  boot_completed=$(adb shell getprop dev.bootcomplete 2>/dev/null || echo "0")
  if [ "$boot_completed" = "1" ]; then
    echo -e "${GREEN}✓ Device is fully booted${NC}"
    break
  fi
  sleep 1
done

echo -e "${GREEN}✓ Device ready! Starting app...${NC}"

# Run the react-native android command with any additional arguments
react-native run-android "$@"
