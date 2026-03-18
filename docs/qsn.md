# Building a Post-Quantum Decentralized Network: Testing QuantumSimulateNexus

Integrating Kademlia-based P2P routing, blockchain state management, and Q# quantum simulations into a single C++ architecture is a massive undertaking. QuantumSimulateNexus bridges the gap between simulated quantum states and classical decentralized networking, providing a robust backend for high-performance applications like Unreal Engine 5 plugins.

This guide provides a complete, out-of-the-box testing suite so you can spin up a local mesh network, secure it with Post-Quantum Cryptography (PQC), and trigger a quantum teleportation simulation directly from C++.

---

## 1. The Local Mesh Spawner (Python)

Before the C++ client can interact with the network, we need to spin up a local P2P mesh. This script initializes two autonomous nodes on your local machine: a target node (Node A) and a local entry point (Node B) that our C++ client will connect to.

Create `test_network.py` in your project root:

```python
import time
from cp.node import QSNNode

def main():
    print("--- Starting QuantumSimulateNexus Local Testnet ---")

    # Node A: The Target Node it's simulating a remote peer
    node_a = QSNNode("127.0.0.1", 8080, node_id="TARGET_NODE_A")
    node_a.start()

    # Node B: The Local Entry Point
    # This is the node the C++ client will connect to.
    # It bootstraps to Node A.
    node_b = QSNNode("127.0.0.1", 8081, node_id="LOCAL_NODE_B")
    node_b.start(bootstrap_peers=[("127.0.0.1", 8080)])

    print("\n[Testnet] Mesh network is live.")
    print("[Testnet] Point your C++ QSNClient to 127.0.0.1:8081\n")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n[Testnet] Shutting down...")
        node_a.stop()
        node_b.stop()

if __name__ == "__main__":
    main()
```

## 2. The Developer API Example (C++)

Because the architecture compiles as a static library, it is highly portable. This C++ application connects to Node B, mints tokens on the blockchain using ML-DSA signatures, and initiates a quantum state transmission to Node A using custom $X$ and $Z$ rotation angles ($\theta$ and $\phi$).

Create `main.cpp` alongside your client source files:

```cpp
#include "QSNClient.h"
#include <iostream>
#include <thread>
#include <chrono>
#include <cmath>

using namespace QuantumSimulateNexus;

int main() {
    QSNClient client;
    
    std::cout << "1. Initializing QSN Client...\n";
    if (!client.Initialize("127.0.0.1", 8081)) {
        std::cerr << "Failed to connect to local node. Is test_network.py running?\n";
        return 1;
    }
    std::cout << "Connected!\n\n";

    // TEST Post-Quantum Blockchain 
    std::cout << "2. Testing ML-DSA Signed Transaction...\n";
    Transaction tx;
    tx.action = "MINT_TOKEN";
    tx.sender = "Dev_Alice";
    tx.token = "Q-Coin";
    tx.amount = 500;

    if (client.SubmitTransaction(tx)) {
        std::cout << "Transaction submitted to the network.\n";
    }

    std::this_thread::sleep_for(std::chrono::seconds(2));
    int balance = client.QueryBalance("Dev_Alice", "Q-Coin");
    std::cout << "Alice's Confirmed Balance: " << balance << " Q-Coin\n\n";

    // TEST Hybrid Quantum Teleportation
    std::cout << "3. Testing ML-KEM Secured Quantum Teleportation...\n";
    
    std::string targetNodeId = "TARGET_NODE_A"; 
    bool initialPayloadState = true; 
    
    // Prepare a custom superposition state
    double theta = M_PI / 2.0; 
    double phi = M_PI / 4.0;   

    std::cout << "Transmitting state to " << targetNodeId << "...\n";
    if (client.HybridTeleport(targetNodeId, initialPayloadState, theta, phi)) {
        std::cout << "Teleportation command dispatched successfully.\n";
    } else {
        std::cerr << "Teleportation dispatch failed.\n";
    }

    std::this_thread::sleep_for(std::chrono::seconds(5));

    client.Shutdown();
    std::cout << "\nTests complete. Disconnected.\n";
    return 0;
}
```

## 3. Building and Running

To compile and run the test suite, ensure your `CMakeLists.txt` is configured to link the `QSNClient` library and `liboqs` to your new executable. 

Update your CMake configuration to include:

```cmake
add_executable(QSNTest main.cpp)
target_link_libraries(QSNTest PRIVATE QSNClient oqs::oqs)
```

**Execution Steps:**
1. Open a terminal and start the mesh network: `python test_network.py`
2. Build the C++ project using CMake.
3. Open a second terminal and run the compiled `QSNTest` executable.

You will see the C++ application orchestrate the network commands while the Python terminal outputs the real-time Q# evaluation results, cryptographic handshakes, and relativistic causality checks.