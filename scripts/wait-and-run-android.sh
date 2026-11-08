#!/bin/bash
# Helper script to ensure Android emulator is ready before running the app
# Automatically launches emulator if one isn't already running, then waits for boot completion

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the default emulator or first available one
get_emulator() {
  local emulators=$(emulator -list-avds 2>/dev/null)
  if [ -z "$emulators" ]; then
    echo -e "${RED}✗ No emulators found. Please create one in Android Studio.${NC}"
    exit 1
  fi
  # Return the first emulator
  echo "$emulators" | head -n1
}

# Check if any device/emulator is already connected
check_connected_devices() {
  adb devices | grep -v "^$" | tail -n +2 | wc -l
}

EMULATOR_NAME=$(get_emulator)
CONNECTED=$(check_connected_devices)

if [ "$CONNECTED" -eq 0 ]; then
  echo -e "${YELLOW}📱 No emulator running. Launching: $EMULATOR_NAME${NC}"
  emulator -avd "$EMULATOR_NAME" -no-snapshot-load > /dev/null 2>&1 &
  EMULATOR_PID=$!
  sleep 2
  echo -e "${YELLOW}⏳ Emulator starting in background (PID: $EMULATOR_PID)...${NC}"
else
  echo -e "${GREEN}✓ Emulator already running${NC}"
fi

echo -e "${YELLOW}⏳ Waiting for device to connect...${NC}"

# Wait for device connection with timeout (max 120 seconds)
wait_counter=0
max_wait=120
while [ $wait_counter -lt $max_wait ]; do
  connected=$(adb devices | grep -E "emulator|device" | grep -v "devices" | wc -l)
  if [ "$connected" -gt 0 ]; then
    break
  fi
  sleep 1
  wait_counter=$((wait_counter + 1))
  if [ $((wait_counter % 10)) -eq 0 ]; then
    echo -e "${YELLOW}  ...still waiting ($wait_counter/$max_wait)${NC}"
  fi
done

if [ $wait_counter -ge $max_wait ]; then
  echo -e "${RED}✗ Device connection timeout${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Device connected${NC}"

# Wait for device to finish booting (check boot_completed property)
echo -e "${YELLOW}⏳ Waiting for device to finish booting...${NC}"

boot_timeout=0
boot_max_wait=300
while [ $boot_timeout -lt $boot_max_wait ]; do
  boot_completed=$(adb shell getprop dev.bootcomplete 2>/dev/null || echo "0")
  if [ "$boot_completed" = "1" ]; then
    echo -e "${GREEN}✓ Device is fully booted${NC}"
    break
  fi
  sleep 1
  boot_timeout=$((boot_timeout + 1))
  if [ $((boot_timeout % 15)) -eq 0 ]; then
    echo -e "${YELLOW}  ...still booting ($boot_timeout/$boot_max_wait)${NC}"
  fi
done

if [ $boot_timeout -ge $boot_max_wait ]; then
  echo -e "${RED}✗ Device boot timeout after 5 minutes${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Device ready! Starting app...${NC}"

# Run the react-native android command with any additional arguments
react-native run-android "$@"
