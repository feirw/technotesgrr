import type { CodeLanguage, StructureKind } from '../types';

const traversalSnippets = {
  preorder: {
    python: `def preorder(root):\n    if root:\n        visit(root)\n        preorder(root.left)\n        preorder(root.right)`,
    javascript: `function preorder(root) {\n  if (!root) return;\n  visit(root);\n  preorder(root.left);\n  preorder(root.right);\n}`,
    java: `void preorder(Node root) {\n  if (root == null) return;\n  visit(root);\n  preorder(root.left);\n  preorder(root.right);\n}`,
    c: `void preorder(Node* root) {\n  if (!root) return;\n  visit(root);\n  preorder(root->left);\n  preorder(root->right);\n}`,
    cpp: `void preorder(Node* root) {\n  if (!root) return;\n  visit(root);\n  preorder(root->left);\n  preorder(root->right);\n}`,
    pseudocode: `ΠΡΟΔΙΑΤΑΞΗ(ρίζα)\n  αν ρίζα ≠ null\n    επίσκεψη(ρίζα)\n    ΠΡΟΔΙΑΤΑΞΗ(αριστερά)\n    ΠΡΟΔΙΑΤΑΞΗ(δεξιά)`,
  },
} as const;

const snippets: Record<StructureKind, Record<string, Record<CodeLanguage, string>>> = {
  'binary-tree': {
    'insert-left': {
      python: `def set_left(parent, value):\n    parent.left = Node(value)`,
      javascript: `function setLeft(parent, value) {\n  parent.left = new Node(value);\n}`,
      java: `void setLeft(Node parent, int value) {\n  parent.left = new Node(value);\n}`,
      c: `void setLeft(Node* parent, int value) {\n  parent->left = createNode(value);\n}`,
      cpp: `void setLeft(Node* parent, int value) {\n  parent->left = new Node(value);\n}`,
      pseudocode: `ΘΕΣΕ_ΑΡΙΣΤΕΡΑ(γονέας, τιμή)\n  γονέας.αριστερά ← νέος κόμβος(τιμή)`,
    },
    'insert-right': {
      python: `def set_right(parent, value):\n    parent.right = Node(value)`,
      javascript: `function setRight(parent, value) {\n  parent.right = new Node(value);\n}`,
      java: `void setRight(Node parent, int value) {\n  parent.right = new Node(value);\n}`,
      c: `void setRight(Node* parent, int value) {\n  parent->right = createNode(value);\n}`,
      cpp: `void setRight(Node* parent, int value) {\n  parent->right = new Node(value);\n}`,
      pseudocode: `ΘΕΣΕ_ΔΕΞΙΑ(γονέας, τιμή)\n  γονέας.δεξιά ← νέος κόμβος(τιμή)`,
    },
    delete: {
      python: `# Διαγραφή κόμβου και υποδέντρου\ndef delete_subtree(parent, child): ...`,
      javascript: `// Διαγραφή κόμβου και υποδέντρου`,
      java: `// Διαγραφή κόμβου και υποδέντρου`,
      c: `/* Διαγραφή κόμβου και υποδέντρου */`,
      cpp: `// Διαγραφή κόμβου και υποδέντρου`,
      pseudocode: `ΔΙΑΓΡΑΦΗ_ΥΠΟΔΕΝΤΡΟΥ(κόμβος)`,
    },
    preorder: traversalSnippets.preorder,
  },
  bst: {
    insert: {
      python: `def insert(root, value):\n    if root is None:\n        return Node(value)\n    if value < root.value:\n        root.left = insert(root.left, value)\n    elif value > root.value:\n        root.right = insert(root.right, value)\n    return root`,
      javascript: `function insert(root, value) {\n  if (!root) return new Node(value);\n  if (value < root.value) root.left = insert(root.left, value);\n  else if (value > root.value) root.right = insert(root.right, value);\n  return root;\n}`,
      java: `Node insert(Node root, int value) {\n  if (root == null) return new Node(value);\n  if (value < root.value) root.left = insert(root.left, value);\n  else if (value > root.value) root.right = insert(root.right, value);\n  return root;\n}`,
      c: `Node* insert(Node* root, int value) {\n  if (!root) return createNode(value);\n  if (value < root->value) root->left = insert(root->left, value);\n  else if (value > root->value) root->right = insert(root->right, value);\n  return root;\n}`,
      cpp: `Node* insert(Node* root, int value) {\n  if (!root) return new Node(value);\n  if (value < root->value) root->left = insert(root->left, value);\n  else if (value > root->value) root->right = insert(root->right, value);\n  return root;\n}`,
      pseudocode: `INSERT(root, value)\n  if root is null → return new node(value)\n  if value < root.value → root.left ← INSERT(root.left, value)\n  else if value > root.value → root.right ← INSERT(root.right, value)\n  return root`,
    },
    delete: {
      python: `def delete(root, value):\n    if root is None: return None\n    if value < root.value:\n        root.left = delete(root.left, value)\n    elif value > root.value:\n        root.right = delete(root.right, value)\n    else:\n        if not root.left: return root.right\n        if not root.right: return root.left\n        succ = min_value(root.right)\n        root.value = succ.value\n        root.right = delete(root.right, succ.value)\n    return root`,
      javascript: `function deleteNode(root, value) {\n  if (!root) return null;\n  if (value < root.value) root.left = deleteNode(root.left, value);\n  else if (value > root.value) root.right = deleteNode(root.right, value);\n  else {\n    if (!root.left) return root.right;\n    if (!root.right) return root.left;\n    const succ = minValue(root.right);\n    root.value = succ.value;\n    root.right = deleteNode(root.right, succ.value);\n  }\n  return root;\n}`,
      java: `Node delete(Node root, int value) {\n  if (root == null) return null;\n  if (value < root.value) root.left = delete(root.left, value);\n  else if (value > root.value) root.right = delete(root.right, value);\n  else {\n    if (root.left == null) return root.right;\n    if (root.right == null) return root.left;\n    Node succ = minValue(root.right);\n    root.value = succ.value;\n    root.right = delete(root.right, succ.value);\n  }\n  return root;\n}`,
      c: `Node* deleteNode(Node* root, int value) {\n  if (!root) return NULL;\n  if (value < root->value) root->left = deleteNode(root->left, value);\n  else if (value > root->value) root->right = deleteNode(root->right, value);\n  else {\n    if (!root->left) { Node* t = root->right; free(root); return t; }\n    if (!root->right) { Node* t = root->left; free(root); return t; }\n    Node* succ = minValue(root->right);\n    root->value = succ->value;\n    root->right = deleteNode(root->right, succ->value);\n  }\n  return root;\n}`,
      cpp: `Node* deleteNode(Node* root, int value) {\n  if (!root) return nullptr;\n  if (value < root->value) root->left = deleteNode(root->left, value);\n  else if (value > root->value) root->right = deleteNode(root->right, value);\n  else {\n    if (!root->left) return root->right;\n    if (!root->right) return root->left;\n    Node* succ = minValue(root->right);\n    root->value = succ->value;\n    root->right = deleteNode(root->right, succ->value);\n  }\n  return root;\n}`,
      pseudocode: `DELETE(root, value)\n  locate node\n  if leaf → remove\n  if one child → promote child\n  if two children → replace with inorder successor, delete successor`,
    },
    search: {
      python: `def search(root, value):\n    if root is None or root.value == value:\n        return root\n    if value < root.value:\n        return search(root.left, value)\n    return search(root.right, value)`,
      javascript: `function search(root, value) {\n  if (!root || root.value === value) return root;\n  if (value < root.value) return search(root.left, value);\n  return search(root.right, value);\n}`,
      java: `Node search(Node root, int value) {\n  if (root == null || root.value == value) return root;\n  if (value < root.value) return search(root.left, value);\n  return search(root.right, value);\n}`,
      c: `Node* search(Node* root, int value) {\n  if (!root || root->value == value) return root;\n  if (value < root->value) return search(root->left, value);\n  return search(root->right, value);\n}`,
      cpp: `Node* search(Node* root, int value) {\n  if (!root || root->value == value) return root;\n  if (value < root->value) return search(root->left, value);\n  return search(root->right, value);\n}`,
      pseudocode: `SEARCH(root, value)\n  if root is null or root.value = value → return root\n  if value < root.value → SEARCH(root.left, value)\n  else SEARCH(root.right, value)`,
    },
    preorder: {
      python: `def preorder(root):\n    if root:\n        visit(root)\n        preorder(root.left)\n        preorder(root.right)`,
      javascript: `function preorder(root) {\n  if (!root) return;\n  visit(root);\n  preorder(root.left);\n  preorder(root.right);\n}`,
      java: `void preorder(Node root) {\n  if (root == null) return;\n  visit(root);\n  preorder(root.left);\n  preorder(root.right);\n}`,
      c: `void preorder(Node* root) {\n  if (!root) return;\n  visit(root);\n  preorder(root->left);\n  preorder(root->right);\n}`,
      cpp: `void preorder(Node* root) {\n  if (!root) return;\n  visit(root);\n  preorder(root->left);\n  preorder(root->right);\n}`,
      pseudocode: `PREORDER(root)\n  if root ≠ null\n    visit(root)\n    PREORDER(root.left)\n    PREORDER(root.right)`,
    },
    inorder: {
      python: `def inorder(root):\n    if root:\n        inorder(root.left)\n        visit(root)\n        inorder(root.right)`,
      javascript: `function inorder(root) {\n  if (!root) return;\n  inorder(root.left);\n  visit(root);\n  inorder(root.right);\n}`,
      java: `void inorder(Node root) {\n  if (root == null) return;\n  inorder(root.left);\n  visit(root);\n  inorder(root.right);\n}`,
      c: `void inorder(Node* root) {\n  if (!root) return;\n  inorder(root->left);\n  visit(root);\n  inorder(root->right);\n}`,
      cpp: `void inorder(Node* root) {\n  if (!root) return;\n  inorder(root->left);\n  visit(root);\n  inorder(root->right);\n}`,
      pseudocode: `INORDER(root)\n  if root ≠ null\n    INORDER(root.left)\n    visit(root)\n    INORDER(root.right)`,
    },
    postorder: {
      python: `def postorder(root):\n    if root:\n        postorder(root.left)\n        postorder(root.right)\n        visit(root)`,
      javascript: `function postorder(root) {\n  if (!root) return;\n  postorder(root.left);\n  postorder(root.right);\n  visit(root);\n}`,
      java: `void postorder(Node root) {\n  if (root == null) return;\n  postorder(root.left);\n  postorder(root.right);\n  visit(root);\n}`,
      c: `void postorder(Node* root) {\n  if (!root) return;\n  postorder(root->left);\n  postorder(root->right);\n  visit(root);\n}`,
      cpp: `void postorder(Node* root) {\n  if (!root) return;\n  postorder(root->left);\n  postorder(root->right);\n  visit(root);\n}`,
      pseudocode: `POSTORDER(root)\n  if root ≠ null\n    POSTORDER(root.left)\n    POSTORDER(root.right)\n    visit(root)`,
    },
    levelorder: {
      python: `from collections import deque\ndef levelorder(root):\n    if not root: return\n    q = deque([root])\n    while q:\n        node = q.popleft()\n        visit(node)\n        if node.left: q.append(node.left)\n        if node.right: q.append(node.right)`,
      javascript: `function levelorder(root) {\n  if (!root) return;\n  const q = [root];\n  while (q.length) {\n    const node = q.shift();\n    visit(node);\n    if (node.left) q.push(node.left);\n    if (node.right) q.push(node.right);\n  }\n}`,
      java: `void levelorder(Node root) {\n  if (root == null) return;\n  Queue<Node> q = new LinkedList<>();\n  q.add(root);\n  while (!q.isEmpty()) {\n    Node node = q.poll();\n    visit(node);\n    if (node.left != null) q.add(node.left);\n    if (node.right != null) q.add(node.right);\n  }\n}`,
      c: `/* Use a queue of Node* */\nvoid levelorder(Node* root) {\n  if (!root) return;\n  enqueue(root);\n  while (!empty()) {\n    Node* node = dequeue();\n    visit(node);\n    if (node->left) enqueue(node->left);\n    if (node->right) enqueue(node->right);\n  }\n}`,
      cpp: `void levelorder(Node* root) {\n  if (!root) return;\n  queue<Node*> q;\n  q.push(root);\n  while (!q.empty()) {\n    Node* node = q.front(); q.pop();\n    visit(node);\n    if (node->left) q.push(node->left);\n    if (node->right) q.push(node->right);\n  }\n}`,
      pseudocode: `LEVELORDER(root)\n  enqueue(root)\n  while queue not empty\n    node ← dequeue()\n    visit(node)\n    enqueue children`,
    },
  },
  'linked-list': {
    'insert-beginning': {
      python: `def insert_beginning(head, value):\n    node = Node(value)\n    node.next = head\n    return node`,
      javascript: `function insertBeginning(head, value) {\n  const node = new Node(value);\n  node.next = head;\n  return node;\n}`,
      java: `Node insertBeginning(Node head, int value) {\n  Node node = new Node(value);\n  node.next = head;\n  return node;\n}`,
      c: `Node* insertBeginning(Node* head, int value) {\n  Node* node = createNode(value);\n  node->next = head;\n  return node;\n}`,
      cpp: `Node* insertBeginning(Node* head, int value) {\n  Node* node = new Node(value);\n  node->next = head;\n  return node;\n}`,
      pseudocode: `INSERT_BEGINNING(head, value)\n  node ← new Node(value)\n  node.next ← head\n  head ← node`,
    },
    reverse: {
      python: `def reverse(head):\n    prev, curr = None, head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev, curr = curr, nxt\n    return prev`,
      javascript: `function reverse(head) {\n  let prev = null, curr = head;\n  while (curr) {\n    const nxt = curr.next;\n    curr.next = prev;\n    prev = curr; curr = nxt;\n  }\n  return prev;\n}`,
      java: `Node reverse(Node head) {\n  Node prev = null, curr = head;\n  while (curr != null) {\n    Node nxt = curr.next;\n    curr.next = prev;\n    prev = curr; curr = nxt;\n  }\n  return prev;\n}`,
      c: `Node* reverse(Node* head) {\n  Node *prev = NULL, *curr = head;\n  while (curr) {\n    Node* nxt = curr->next;\n    curr->next = prev;\n    prev = curr; curr = nxt;\n  }\n  return prev;\n}`,
      cpp: `Node* reverse(Node* head) {\n  Node *prev = nullptr, *curr = head;\n  while (curr) {\n    Node* nxt = curr->next;\n    curr->next = prev;\n    prev = curr; curr = nxt;\n  }\n  return prev;\n}`,
      pseudocode: `REVERSE(head)\n  prev ← null, curr ← head\n  while curr ≠ null\n    next ← curr.next\n    curr.next ← prev\n    prev ← curr, curr ← next\n  head ← prev`,
    },
  },
  'directed-graph': {
    dfs: {
      python: `def dfs(graph, start, visited=None):\n    if visited is None: visited = set()\n    visited.add(start)\n    for n in graph[start]:\n        if n not in visited:\n            dfs(graph, n, visited)\n    return visited`,
      javascript: `function dfs(graph, start, visited = new Set()) {\n  visited.add(start);\n  for (const n of graph[start] || []) {\n    if (!visited.has(n)) dfs(graph, n, visited);\n  }\n  return visited;\n}`,
      java: `void dfs(Map<Integer, List<Integer>> g, int u, Set<Integer> visited) {\n  visited.add(u);\n  for (int v : g.getOrDefault(u, List.of()))\n    if (!visited.contains(v)) dfs(g, v, visited);\n}`,
      c: `void dfs(Graph* g, int u, int* visited) {\n  visited[u] = 1;\n  for (int v = 0; v < g->n; v++)\n    if (g->adj[u][v] && !visited[v]) dfs(g, v, visited);\n}`,
      cpp: `void dfs(vector<vector<int>>& g, int u, vector<bool>& visited) {\n  visited[u] = true;\n  for (int v : g[u]) if (!visited[v]) dfs(g, v, visited);\n}`,
      pseudocode: `DFS(u)\n  mark u visited\n  for each neighbor v of u\n    if v not visited → DFS(v)`,
    },
    bfs: {
      python: `from collections import deque\ndef bfs(graph, start):\n    visited, q = {start}, deque([start])\n    while q:\n        u = q.popleft()\n        for v in graph[u]:\n            if v not in visited:\n                visited.add(v); q.append(v)\n    return visited`,
      javascript: `function bfs(graph, start) {\n  const visited = new Set([start]);\n  const q = [start];\n  while (q.length) {\n    const u = q.shift();\n    for (const v of graph[u] || []) {\n      if (!visited.has(v)) { visited.add(v); q.push(v); }\n    }\n  }\n  return visited;\n}`,
      java: `void bfs(Map<Integer, List<Integer>> g, int start) {\n  Set<Integer> visited = new HashSet<>();\n  Queue<Integer> q = new LinkedList<>();\n  visited.add(start); q.add(start);\n  while (!q.isEmpty()) {\n    int u = q.poll();\n    for (int v : g.getOrDefault(u, List.of()))\n      if (visited.add(v)) q.add(v);\n  }\n}`,
      c: `void bfs(Graph* g, int start) {\n  int visited[MAX] = {0};\n  enqueue(start); visited[start] = 1;\n  while (!empty()) {\n    int u = dequeue();\n    for (int v = 0; v < g->n; v++)\n      if (g->adj[u][v] && !visited[v]) { visited[v] = 1; enqueue(v); }\n  }\n}`,
      cpp: `void bfs(vector<vector<int>>& g, int start) {\n  vector<bool> visited(g.size());\n  queue<int> q;\n  visited[start] = true; q.push(start);\n  while (!q.empty()) {\n    int u = q.front(); q.pop();\n    for (int v : g[u]) if (!visited[v]) { visited[v] = true; q.push(v); }\n  }\n}`,
      pseudocode: `BFS(start)\n  enqueue(start); mark visited\n  while queue not empty\n    u ← dequeue()\n    for each neighbor v\n      if not visited → mark, enqueue(v)`,
    },
  },
  'undirected-graph': {
    dfs: {
      python: `def dfs(graph, start, visited=None):\n    if visited is None: visited = set()\n    visited.add(start)\n    for n in graph[start]:\n        if n not in visited:\n            dfs(graph, n, visited)\n    return visited`,
      javascript: `function dfs(graph, start, visited = new Set()) {\n  visited.add(start);\n  for (const n of graph[start] || []) {\n    if (!visited.has(n)) dfs(graph, n, visited);\n  }\n  return visited;\n}`,
      java: `void dfs(Map<Integer, List<Integer>> g, int u, Set<Integer> visited) {\n  visited.add(u);\n  for (int v : g.getOrDefault(u, List.of()))\n    if (!visited.contains(v)) dfs(g, v, visited);\n}`,
      c: `void dfs(Graph* g, int u, int* visited) {\n  visited[u] = 1;\n  for (int v = 0; v < g->n; v++)\n    if (g->adj[u][v] && !visited[v]) dfs(g, v, visited);\n}`,
      cpp: `void dfs(vector<vector<int>>& g, int u, vector<bool>& visited) {\n  visited[u] = true;\n  for (int v : g[u]) if (!visited[v]) dfs(g, v, visited);\n}`,
      pseudocode: `DFS(u)\n  mark u visited\n  for each neighbor v of u\n    if v not visited → DFS(v)`,
    },
    bfs: {
      python: `from collections import deque\ndef bfs(graph, start):\n    visited, q = {start}, deque([start])\n    while q:\n        u = q.popleft()\n        for v in graph[u]:\n            if v not in visited:\n                visited.add(v); q.append(v)\n    return visited`,
      javascript: `function bfs(graph, start) {\n  const visited = new Set([start]);\n  const q = [start];\n  while (q.length) {\n    const u = q.shift();\n    for (const v of graph[u] || []) {\n      if (!visited.has(v)) { visited.add(v); q.push(v); }\n    }\n  }\n  return visited;\n}`,
      java: `void bfs(Map<Integer, List<Integer>> g, int start) {\n  Set<Integer> visited = new HashSet<>();\n  Queue<Integer> q = new LinkedList<>();\n  visited.add(start); q.add(start);\n  while (!q.isEmpty()) {\n    int u = q.poll();\n    for (int v : g.getOrDefault(u, List.of()))\n      if (visited.add(v)) q.add(v);\n  }\n}`,
      c: `void bfs(Graph* g, int start) {\n  int visited[MAX] = {0};\n  enqueue(start); visited[start] = 1;\n  while (!empty()) {\n    int u = dequeue();\n    for (int v = 0; v < g->n; v++)\n      if (g->adj[u][v] && !visited[v]) { visited[v] = 1; enqueue(v); }\n  }\n}`,
      cpp: `void bfs(vector<vector<int>>& g, int start) {\n  vector<bool> visited(g.size());\n  queue<int> q;\n  visited[start] = true; q.push(start);\n  while (!q.empty()) {\n    int u = q.front(); q.pop();\n    for (int v : g[u]) if (!visited[v]) { visited[v] = true; q.push(v); }\n  }\n}`,
      pseudocode: `BFS(start)\n  enqueue(start); mark visited\n  while queue not empty\n    u ← dequeue()\n    for each neighbor v\n      if not visited → mark, enqueue(v)`,
    },
  },
  'general-tree': {
    'add-node': {
      python: `def add_child(parent, label):\n    child = Node(label)\n    parent.children.append(child)\n    return child`,
      javascript: `function addChild(parent, label) {\n  const child = new Node(label);\n  parent.children.push(child);\n  return child;\n}`,
      java: `Node addChild(Node parent, String label) {\n  Node child = new Node(label);\n  parent.children.add(child);\n  return child;\n}`,
      c: `void addChild(Node* parent, Node* child) {\n  parent->children[parent->childCount++] = child;\n}`,
      cpp: `void addChild(Node* parent, Node* child) {\n  parent->children.push_back(child);\n}`,
      pseudocode: `ADD_CHILD(parent, label)\n  child ← new Node(label)\n  append child to parent.children`,
    },
  },
};

const fallback: Record<CodeLanguage, string> = {
  python: '# Επιλέξτε μια πράξη για να δείτε τον παραγόμενο κώδικα.',
  javascript: '// Επιλέξτε μια πράξη για να δείτε τον παραγόμενο κώδικα.',
  java: '// Επιλέξτε μια πράξη για να δείτε τον παραγόμενο κώδικα.',
  c: '/* Επιλέξτε μια πράξη για να δείτε τον παραγόμενο κώδικα. */',
  cpp: '// Επιλέξτε μια πράξη για να δείτε τον παραγόμενο κώδικα.',
  pseudocode: 'Επιλέξτε μια πράξη για να δείτε τον παραγόμενο κώδικα.',
};

export function generateCode(
  kind: StructureKind,
  operation: string,
  language: CodeLanguage
): string {
  const byOp = snippets[kind]?.[operation];
  if (byOp?.[language]) return byOp[language];
  // Κοινές διασχίσεις δυαδικού / ΔΔΑ
  if (
    (kind === 'binary-tree' || kind === 'bst') &&
    snippets.bst[operation]?.[language]
  ) {
    return snippets.bst[operation][language];
  }
  const aliases = Object.keys(snippets[kind] ?? {});
  const match = aliases.find((a) => operation.includes(a) || a.includes(operation));
  if (match && snippets[kind][match]?.[language]) return snippets[kind][match][language];
  return fallback[language];
}
