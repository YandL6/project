/* ===================================================================
   LeetCode Hot 100 — 应用逻辑
   =================================================================== */

// ===================================================================
// 数据层
// ===================================================================
const PROB_STORAGE_KEY = 'leetcode_hot100_data';
const KNOW_STORAGE_KEY = 'leetcode_knowledge_data';
const CONFUSION_STORAGE_KEY = 'leetcode_confusion_data';
const TOTAL_HOT100 = 100;
const DATA_VERSION = 60; // 默认数据版本，更新默认数据时 +1
const VERSION_KEY = 'leetcode_data_version';
let problems = [];
let knowledge = [];
let confusions = [];

// 编辑/详情状态
let probEditingId = null;
let probDetailId = null;
let knowledgeEditingId = null;
let confusionEditingId = null;
let currentKnowledgeView = 'list'; // 'list' | 'detail'
let currentConfusionView = 'list'; // 'list' | 'detail'

// ===================================================================
// 默认数据
// ===================================================================
const DEFAULT_PROBLEMS = [
  {
    id: 1, number: 1, title: '两数之和', titleEn: 'Two Sum', difficulty: '简单',
    knowledge: ['vector', 'unordered_map', '哈希表'],
    solution: '方法一：暴力枚举\n双重循环遍历所有组合，检查 nums[i] + nums[j] == target。\n时间复杂度 O(n²)，空间复杂度 O(1)。\n\n方法二：哈希表（最优）\n遍历数组，用 unordered_map 存储每个元素的值与下标的映射。\n对于当前元素 nums[i]，检查 target - nums[i] 是否已在 map 中：\n- 若存在，说明找到了两个数，返回对应下标\n- 若不存在，将当前元素加入 map\n\n时间复杂度 O(n)，空间复杂度 O(n)。',
    keyDifficulties: '1. 理解哈希表如何将查找时间从 O(n) 降低到 O(1)\n2. map 中存储的是已遍历过的元素，避免同一元素被重复使用\n3. 边界条件：数组长度为 2 时直接比较\n4. unordered_map 的 find() 与 count() 方法的区别',
    createdAt: '2026-07-29T10:00:00'
  },
  {
    id: 2, number: 20, title: '有效的括号', titleEn: 'Valid Parentheses', difficulty: '简单',
    knowledge: ['stack', '哈希表'],
    solution: '核心思路：利用栈的「后进先出」特性匹配括号。\n\n具体步骤：\n1. 创建一个空栈，用哈希表存储右括号到左括号的映射 {")":"(", "}":"{", "]":"["}\n2. 遍历字符串每个字符 c：\n   - 如果 c 是左括号（"( "{ "["），将其压入栈\n   - 如果 c 是右括号：\n     * 若栈为空 → 返回 false（没有对应的左括号）\n     * 取栈顶元素 top，检查 map[c] == top\n     * 若匹配 → 弹出栈顶，继续遍历\n     * 若不匹配 → 返回 false\n3. 遍历结束后，检查栈是否为空\n   - 栈为空 → 所有括号正确匹配 → 返回 true\n   - 栈不为空 → 有未闭合的左括号 → 返回 false\n\n时间复杂度 O(n)，空间复杂度 O(n)（栈 + 哈希表）。',
    keyDifficulties: '1. 理解栈的 LIFO 特性正好契合括号嵌套的匹配规则\n2. 利用哈希表建立右括号到左括号的映射，代码更简洁\n3. 注意边界情况：空字符串应返回 true、只有左括号/只有右括号的处理\n4. 遍历结束后必须检查栈是否为空（如 "((" 的情况）',
    createdAt: '2026-07-29T12:00:00'
  },
  {
    id: 3, number: 21, title: '合并两个有序链表', titleEn: 'Merge Two Sorted Lists', difficulty: '简单',
    knowledge: ['链表', '递归', '迭代', '哑节点'],
    solution: '核心思路：迭代法，利用哑节点简化头节点处理。\n\n具体步骤：\n1. 创建哑节点 dummy，尾指针 tail 指向 dummy\n2. 同时遍历 list1 和 list2，比较当前节点值：\n   - 将值较小的节点接在 tail 后面\n   - 移动该链表指针和 tail 指针\n3. 遍历结束后，将剩余链表直接拼接\n4. 返回 dummy.next\n\n迭代法：时间 O(n+m)，空间 O(1)\n递归法：时间 O(n+m)，空间 O(n+m)（递归栈）',
    keyDifficulties: '1. 哑节点的使用：避免对头节点是否为空的特殊判断，代码更简洁\n2. 指针操作：tail 始终指向新链表尾节点；拼接剩余链表时直接 tail->next = 剩余链表，无需再遍历\n3. 复用节点：本题要求拼接原链表节点，不要用 new 创建新节点\n4. 空链表处理：若一个为空直接返回另一个；都为空返回 nullptr',
    createdAt: '2026-07-30T10:00:00'
  },
  {
    id: 4, number: 70, title: '爬楼梯', titleEn: 'Climbing Stairs', difficulty: '简单',
    knowledge: ['动态规划', '滚动数组'],
    solution: '核心思路：动态规划 + 滚动数组（斐波那契数列）。\n\n要到达第 n 阶，可以从第 n-1 阶跨 1 步，或者从第 n-2 阶跨 2 步。\n因此 dp[n] = dp[n-1] + dp[n-2]。\n\n动态规划推导：\n1. 定义状态：dp[i] 表示爬到第 i 阶的方法数\n2. 转移方程：dp[i] = dp[i-1] + dp[i-2]\n3. 初始条件：dp[1] = 1, dp[2] = 2\n4. 最终答案：dp[n]\n\n空间优化（滚动数组）：\n由于 dp[i] 只依赖前两个值，用三个变量滚动即可，空间 O(1)。\nint a = 1, b = 2; // a=dp[1], b=dp[2]\nfor (int i = 3; i <= n; i++) {\n    int c = a + b;\n    a = b;\n    b = c;\n}\nreturn b;\n\n时间复杂度 O(n)，空间复杂度 O(1)。',
    keyDifficulties: '1. 识别出这是斐波那契数列的变体，关键是找到递推关系 dp[i] = dp[i-1] + dp[i-2]\n2. 注意 n=1 和 n=2 的边界情况，直接返回 1 和 2\n3. 从 O(n) 空间优化到 O(1) 的滚动数组思想（只保留前两个值）\n4. 进阶：如果一次可以爬 1/2/3 步，递推变 dp[i] = dp[i-1] + dp[i-2] + dp[i-3]',
    createdAt: '2026-07-30T12:00:00'
  },
  {
    id: 5, number: 94, title: '二叉树的中序遍历', titleEn: 'Binary Tree Inorder Traversal', difficulty: '简单',
    knowledge: ['二叉树', '深度优先搜索', '递归', 'stack'],
    solution: '二叉树中序遍历的访问顺序：左子树 → 根节点 → 右子树。\n\n方法一：递归（最直观）\nvoid inorder(TreeNode* root, vector<int>& res) {\n    if (!root) return;\n    inorder(root->left, res);   // 遍历左子树\n    res.push_back(root->val);   // 访问根节点\n    inorder(root->right, res);  // 遍历右子树\n}\n时间复杂度 O(n)，空间复杂度 O(n)（递归栈）。\n\n方法二：迭代（显式栈）\n用栈模拟递归过程：一直往左走并入栈，直到 null 后出栈访问节点，再转向右子树。\nstack<TreeNode*> stk;\nTreeNode* cur = root;\nwhile (cur || !stk.empty()) {\n    while (cur) { stk.push(cur); cur = cur->left; }   // 左路入栈\n    cur = stk.top(); stk.pop();                        // 出栈\n    res.push_back(cur->val);                           // 访问\n    cur = cur->right;                                  // 转向右子树\n}\n时间复杂度 O(n)，空间复杂度 O(n)。\n\n方法三：Morris 遍历（进阶）\n利用线索二叉树思想，O(1) 空间实现中序遍历。',
    keyDifficulties: '1. 理解递归顺序：左-根-右，递归代码简洁但需要理解函数调用栈\n2. 迭代法的核心：用显式栈模拟递归，注意 while 循环的双重条件（cur || !stk.empty()）\n3. 迭代法中，内层 while 将左子树全部入栈，出栈后访问节点再转向右子树\n4. 三种遍历（前序/中序/后序）的迭代写法对比记忆，中序是最自然的「左-根-右」\n5. Morris 遍历 O(1) 空间但会临时修改树结构，面试中优先写迭代或递归',
    createdAt: '2026-07-30T14:00:00'
  },
  {
    id: 6, number: 101, title: '对称二叉树', titleEn: 'Symmetric Tree', difficulty: '简单',
    knowledge: ['二叉树', '深度优先搜索', '递归'],
    solution: '核心思路：判断二叉树是否轴对称，即根节点的左右子树是否互为镜像。\n\n方法一：递归（推荐）\n\n递归函数设计：\n  bool isMirror(TreeNode* t1, TreeNode* t2)\n  功能：判断以 t1 和 t2 为根的两棵子树是否互为镜像\n\n递归步骤：\n  第1步 — 边界条件处理：\n    - 若 t1 和 t2 均为空 → 返回 true（两个空树互为镜像）\n    - 若 t1 和 t2 其中一个为空 → 返回 false（结构不对称）\n  第2步 — 检查当前节点值是否相等：\n    - 若 t1->val != t2->val → 返回 false（值不对称）\n  第3步 — 递归检查子树是否互为镜像：\n    - t1 的左子树 与 t2 的右子树 互为镜像\n    - t1 的右子树 与 t2 的左子树 互为镜像\n    - 两者同时成立才返回 true\n\n递归出口总结：\n  if (!t1 && !t2) return true;\n  if (!t1 || !t2) return false;\n  if (t1->val != t2->val) return false;\n  return isMirror(t1->left, t2->right) && isMirror(t1->right, t2->left);\n\n时间复杂度 O(n)，空间复杂度 O(n)（递归栈深度 = 树高）。\n\n方法二：迭代（队列）\n将需要比较的节点成对入队，每次取出两个节点比较。',
    keyDifficulties: '1. 递归边界条件要覆盖三种情况：都空、一个空、值不等，缺一不可\n2. 镜像比较的规律：左子树的外侧 vs 右子树的外侧，左子树的内侧 vs 右子树的内侧\n3. 不要把对称和相等混淆：相等是 left vs left、right vs right，对称是 left vs right\n4. 递归函数的参数设计是关键——需要同时比较两个节点，所以参数接收左右两棵子树\n5. 空指针检查必须在访问 val 之前，否则会访问空指针导致段错误',
    createdAt: '2026-07-30T15:00:00'
  },
  {
    id: 7, number: 104, title: '二叉树的最大深度', titleEn: 'Maximum Depth of Binary Tree', difficulty: '简单',
    knowledge: ['二叉树', '深度优先搜索', '递归', '广度优先搜索'],
    solution: '核心思路：最大深度 = 根节点到最远叶子节点的节点数，用「分治」思想递归求解。\n\n方法一：递归（DFS，推荐）\n\n递归函数设计：\n  int maxDepth(TreeNode* root)\n  功能：返回以 root 为根的子树的最大深度\n\n递归步骤：\n  第1步 — 边界条件：\n    - 若 root 为空 → 返回 0（空树的深度为 0）\n  第2步 — 分治（拆解子问题）：\n    - 左子树深度 = maxDepth(root->left)\n    - 右子树深度 = maxDepth(root->right)\n  第3步 — 合并结果：\n    - 返回 max(左子树深度, 右子树深度) + 1（加上当前节点这一层）\n\n核心代码：\n  if (!root) return 0;\n  return max(maxDepth(root->left), maxDepth(root->right)) + 1;\n\n时间复杂度 O(n)，空间复杂度 O(n)（最坏情况递归栈深度 = 树高，斜树为 O(n)）。\n\n方法二：迭代（BFS 层序）\n用队列逐层遍历，每处理完一层 depth+1，遍历结束时 depth 即最大深度。\n\n方法三：迭代（DFS + 栈）\n栈中同时存储节点和对应深度，记录最大深度。',
    keyDifficulties: '1. 递归的「分治」三步：终止条件 → 分别求左右子问题 → 合并结果，这是树类 DP/递归题通用模板\n2. 空树返回 0 是边界，必须写对，否则所有结果都会偏移\n3. 加 1 是因为要算上当前根节点这一层，容易漏\n4. BFS 层序法的关键：用 for 循环固定当前层队列大小，逐层计数\n5. 注意「深度」是节点数不是边数：单节点树深度为 1',
    createdAt: '2026-07-30T16:00:00'
  },
  {
    id: 8, number: 121, title: '买卖股票的最佳时机', titleEn: 'Best Time to Buy and Sell Stock', difficulty: '简单',
    knowledge: ['vector', '贪心算法', '动态规划'],
    solution: '核心思路：一次遍历，在遍历过程中维护「历史最低价」，每到一个价格都计算「当天卖出能赚多少」，记录最大值。\n\n方法一：暴力枚举（O(n²)）\n遍历所有买入日 i 和卖出日 j（j > i），求最大差值。超时，仅作思路参考。\n\n方法二：贪心 / 一次遍历（最优）\n\n具体步骤：\n  第1步 — 初始化：\n    int minPrice = INT_MAX;  // 历史最低买入价\n    int maxProfit = 0;       // 最大利润\n  第2步 — 遍历 prices 每个价格 p：\n    - 更新 minPrice = min(minPrice, p)  // 看看今天是不是更便宜\n    - 计算今天卖出的利润 = p - minPrice\n    - 更新 maxProfit = max(maxProfit, p - minPrice)\n  第3步 — 返回 maxProfit\n\n关键洞察：\n在遍历到第 i 天时，minPrice 记录的是「前 i-1 天的最低买入价」，\n因此 p - minPrice 就是「在第 i 天卖出能获得的最大利润」（前提是之前某天买入）。\n\n时间复杂度 O(n)，空间复杂度 O(1)。\n\n方法三：动态规划（转化思路）\n把相邻两天的差价看作收益，问题转化为「最大子数组和」，但贪心写法更简洁，本题用贪心即可。',
    keyDifficulties: '1. 核心洞察：卖出当天的最大利润取决于「之前哪天买入最便宜」，所以维护历史最低价即可\n2. 只能买卖一次！注意题干「某一天买入，未来另一个不同的日子卖出」，不能当天买卖\n3. 如果价格一直下跌，maxProfit 保持 0，符合「不能获取任何利润返回 0」\n4. minPrice 初始化为 INT_MAX 的技巧，保证第一天的更新生效\n5. 与「买卖股票 II（可多次交易）」区分：本题是单次交易，直接用贪心',
    createdAt: '2026-07-30T17:00:00'
  },
  {
    id: 9, number: 136, title: '只出现一次的数字', titleEn: 'Single Number', difficulty: '简单',
    knowledge: ['位运算', 'unordered_map'],
    solution: '核心思路：利用异或（XOR）的性质，将所有元素异或，成对的元素互相抵消，剩下的就是只出现一次的元素。\n\n异或的三个关键性质：\n1. 交换律：a ^ b == b ^ a\n2. 结合律：a ^ (b ^ c) == (a ^ b) ^ c\n3. 自反性：a ^ a = 0，a ^ 0 = a\n\n推导过程：\n假设数组为 [a, a, b, b, c]，全部异或：\n  a ^ a ^ b ^ b ^ c\n= (a ^ a) ^ (b ^ b) ^ c   （结合律、交换律）\n= 0 ^ 0 ^ c                （a^a=0, b^b=0）\n= c                        （0^c=c）\n\n所以遍历一遍数组，把所有元素异或，最终结果就是只出现一次的数字。\n\n核心代码：\n  int result = 0;\n  for (int num : nums) result ^= num;\n  return result;\n\n时间复杂度 O(n)，空间复杂度 O(1) —— 完美满足题目要求。\n\n方法二：哈希表（不满足空间要求）\n用 unordered_map 统计每个数字出现次数，找到次数为 1 的。O(n) 时间但 O(n) 空间，不满足题目「常量额外空间」的限制，仅作思路对比。',
    keyDifficulties: '1. 异或的性质是核心：a^a=0、a^0=a、交换律结合律，能把成对元素「抵消」\n2. 这个解法只适用于「其余元素都出现偶数次」的情况；如果出现 3 次，需要扩展到「按位计数 mod 3」\n3. 注意题目要求 O(1) 空间，哈希表法不满足，会被面试官追问\n4. 位运算常和「消除重复」「找唯一」的题目绑定：如「只出现一次的数字 II/III」「缺失的数字」\n5. 在 C++ 中异或运算符是 ^，注意不要和乘方混淆',
    createdAt: '2026-07-30T18:00:00'
  },
  {
    id: 10, number: 141, title: '环形链表', titleEn: 'Linked List Cycle', difficulty: '简单',
    knowledge: ['链表', '快慢指针', '哈希表'],
    solution: '核心思路：快慢指针（Floyd 判圈算法）。慢指针每次走 1 步，快指针每次走 2 步，如果链表有环，快慢指针一定会相遇；如果无环，快指针会先到达 null。\n\n方法一：快慢指针（最优，O(1) 空间）\n\n具体步骤：\n  第1步 — 初始化两个指针：\n    ListNode* slow = head;\n    ListNode* fast = head;\n  第2步 — 循环遍历，条件是 fast 和 fast->next 都不为空：\n    slow = slow->next;        // 慢指针走 1 步\n    fast = fast->next->next;  // 快指针走 2 步\n    if (slow == fast) return true;  // 相遇 → 有环\n  第3步 — 循环结束（fast 到末尾）→ 无环，返回 false\n\n为什么一定会相遇：\n当 slow 进入环后，fast 已经在环内。每轮 fast 比 slow 多走 1 步，\n相对距离每次减少 1，所以 fast 一定能追上 slow。\n\n核心代码：\n  ListNode *slow = head, *fast = head;\n  while (fast && fast->next) {\n      slow = slow->next;\n      fast = fast->next->next;\n      if (slow == fast) return true;\n  }\n  return false;\n\n时间复杂度 O(n)，空间复杂度 O(1)。\n\n方法二：哈希集合（O(n) 空间）\n用 unordered_set<ListNode*> 记录已访问节点，若某节点已出现过则有环。',
    keyDifficulties: '1. 循环终止条件：必须是 fast && fast->next 都非空，否则访问空指针会崩溃\n2. 为什么 slow 和 fast 一定相遇：快指针每次比慢指针多走 1 步，相对距离递减\n3. 初始时 slow 和 fast 都指向 head，不能一个 head 一个 head->next（那样不相遇时可能错过判断）\n4. 扩展题：求环的入口节点（第 142 题）——相遇后让 slow 回 head，两指针同速走，再次相遇点即入口\n5. 哈希表法空间 O(n)，面试官通常会追问 O(1) 空间的快慢指针法',
    createdAt: '2026-07-30T19:00:00'
  },
  {
    id: 11, number: 160, title: '相交链表', titleEn: 'Intersection of Two Linked Lists', difficulty: '简单',
    knowledge: ['链表', '双指针', '哈希表'],
    solution: '核心思路：双指针「消除长度差」。两个指针分别从 headA、headB 出发，走完自己的链表后切换到对方链表头部继续走，最终会在相交点相遇（或同时到达 null）。\n\n方法一：双指针（最优，O(1) 空间）\n\n具体步骤：\n  第1步 — 初始化：\n    ListNode* pA = headA;\n    ListNode* pB = headB;\n  第2步 — 循环，直到 pA 和 pB 相遇：\n    pA = pA ? pA->next : headB;  // pA 走完 A 后，切到 B 的头部\n    pB = pB ? pB->next : headA;  // pB 走完 B 后，切到 A 的头部\n  第3步 — 返回 pA（相遇点，或都为 null 时返回 null）\n\n为什么一定能相遇：\npA 走过的总长度 = lenA + lenB，pB 走过的总长度 = lenB + lenA，\n两者总长度相同。若存在相交点，则它们会在相交点相遇；\n若无相交点，则它们同时走到 null（pA == pB == nullptr）。\n\n核心代码：\n  ListNode *pA = headA, *pB = headB;\n  while (pA != pB) {\n      pA = pA ? pA->next : headB;\n      pB = pB ? pB->next : headA;\n  }\n  return pA;\n\n时间复杂度 O(m+n)，空间复杂度 O(1)。\n\n方法二：哈希集合（O(m) 空间）\n先遍历 A 存入 unordered_set，再遍历 B 找第一个出现在集合中的节点。\n\n方法三：长度差法\n先求两链表长度，长的先走 lenA-lenB 步，再同步走比较。',
    keyDifficulties: '1. 核心技巧：pA 走完切到 headB、pB 走完切到 headA，从而让两指针走过相同总长度\n2. 循环结束条件 pA != pB：可能相遇于相交节点，也可能同时为 null（不相交）\n3. 注意三元运算符 pA ? pA->next : headB——最后一个节点走完后切到另一条链表，而不是停在原地\n4. 保持原结构：本题不允许修改链表，指针法只读不写，天然满足\n5. 若无交点，最终 pA 和 pB 都为 null 时循环退出，返回 pA 即 null，逻辑统一',
    createdAt: '2026-07-30T20:00:00'
  },
  {
    id: 12, number: 169, title: '多数元素', titleEn: 'Majority Element', difficulty: '简单',
    knowledge: ['vector', 'Boyer-Moore投票法', '哈希表', '排序'],
    solution: '核心思路：Boyer-Moore 投票算法（最优，O(1) 空间）。把不同元素之间的配对「抵消」，多数元素因为数量超过 n/2，抵消后必然还有剩余。\n\n方法一：Boyer-Moore 投票法（最优）\n\n具体步骤：\n  第1步 — 初始化：\n    int candidate = nums[0];  // 候选人\n    int count = 0;            // 票数\n  第2步 — 遍历数组每个元素 num：\n    - 若 count == 0，说明当前候选人被抵消光了，把 num 设为新候选人\n    - 若 num == candidate，count++（投一票）\n    - 否则 count--（抵消一票）\n  第3步 — 遍历结束，candidate 就是多数元素\n\n为什么正确：\n多数元素出现次数 > n/2，即使把它和所有其他元素一一配对抵消，\n它也会剩余至少 1 个。所以最后活下来的 candidate 一定是多数元素。\n\n核心代码：\n  int candidate = 0, count = 0;\n  for (int num : nums) {\n      if (count == 0) candidate = num;\n      count += (num == candidate) ? 1 : -1;\n  }\n  return candidate;\n\n时间复杂度 O(n)，空间复杂度 O(1)。\n\n方法二：哈希表计数（O(n) 空间）\n用 unordered_map 统计每个元素出现次数，找次数 > n/2 的。\n\n方法三：排序（O(n log n)）\n排序后中间位置 nums[n/2] 一定是多数元素（因为多数元素超过一半）。',
    keyDifficulties: '1. 投票法的核心洞察：多数元素超过一半，任意配对抵消后它必有剩余\n2. count == 0 时更换候选人，相当于「前面所有元素被抵消光了」\n3. 候选人不一定全程正确，但最终留下的候选人在「存在多数元素」前提下一定是答案\n4. 本解法的前提是「数组一定存在多数元素」；若不确定存在，还需第二次遍历验证 candidate 次数是否 > n/2\n5. 排序法注意：n/2 是整数除法，多数元素必定占据中间位置',
    createdAt: '2026-07-30T21:00:00'
  },
  {
    id: 13, number: 206, title: '反转链表', titleEn: 'Reverse Linked List', difficulty: '简单',
    knowledge: ['链表', '迭代', '递归'],
    solution: '核心思路：逐个节点「掉头」。让每个节点的 next 指向前一个节点，遍历完整个链表后返回新的头节点（原链表的尾节点）。\n\n方法一：迭代（三指针，推荐）\n\n具体步骤：\n  第1步 — 初始化三个指针：\n    ListNode* prev = nullptr;  // 前一个节点，初始为 null\n    ListNode* curr = head;     // 当前节点\n  第2步 — 遍历链表，循环条件 curr 不为空：\n    - 保存 next = curr->next      （先记住下一个，防止丢失）\n    - 反转 curr->next = prev      （当前节点指向前一个）\n    - prev 前移 = curr            \n    - curr 前移 = next            \n  第3步 — 循环结束，prev 指向原链表的尾节点（即新链表头），返回 prev\n\n核心代码：\n  ListNode *prev = nullptr, *curr = head;\n  while (curr) {\n      ListNode* next = curr->next;  // ① 保存后继\n      curr->next = prev;            // ② 反转指向\n      prev = curr;                  // ③ prev 前移\n      curr = next;                  // ④ curr 前移\n  }\n  return prev;\n\n时间复杂度 O(n)，空间复杂度 O(1)。\n\n方法二：递归\n  递归函数：reverseList(head) 返回反转后的新头\n  终止条件：head 为空或 head->next 为空 → 返回 head\n  递归步骤：\n    newHead = reverseList(head->next)  // 先反转后面的链表\n    head->next->next = head;           // 让下一个节点指回当前节点\n    head->next = nullptr;              // 当前节点断尾\n    return newHead;\n时间复杂度 O(n)，空间复杂度 O(n)（递归栈）。',
    keyDifficulties: '1. 迭代法四步口诀：保存后继 → 反转指向 → prev 前移 → curr 前移\n2. 必须先用临时变量保存 next，否则反转后原链表「断链」，后面的节点就找不到了\n3. 返回的是 prev 而不是 curr（循环结束时 curr 为 null）\n4. 递归法理解重点：先反转后面的，再处理当前节点；head->next->next = head 是关键\n5. 边界情况：空链表或单节点链表，返回 head 本身',
    createdAt: '2026-07-30T22:00:00'
  },
  {
    id: 14, number: 226, title: '翻转二叉树', titleEn: 'Invert Binary Tree', difficulty: '简单',
    knowledge: ['二叉树', '深度优先搜索', '递归', '广度优先搜索'],
    solution: '核心思路：对每个节点交换左右子树，递归/迭代地处理所有节点。翻转后根节点不变，只是左右子树互换。\n\n方法一：递归（推荐）\n\n递归函数设计：\n  TreeNode* invertTree(TreeNode* root)\n  功能：翻转以 root 为根的二叉树，返回新的根（仍为 root）\n\n递归步骤：\n  第1步 — 边界条件：\n    - 若 root 为空 → 返回 nullptr\n  第2步 — 递归翻转左右子树：\n    TreeNode* left  = invertTree(root->left);   // 翻转左子树\n    TreeNode* right = invertTree(root->right);  // 翻转右子树\n  第3步 — 交换左右子树：\n    root->left  = right;\n    root->right = left;\n  第4步 — 返回 root\n\n核心代码：\n  if (!root) return nullptr;\n  TreeNode* left = invertTree(root->left);\n  TreeNode* right = invertTree(root->right);\n  root->left = right;\n  root->right = left;\n  return root;\n\n时间复杂度 O(n)，空间复杂度 O(n)（递归栈深度 = 树高）。\n\n方法二：迭代（BFS 层序，队列）\n用队列逐层遍历每个节点，每取出一个节点就交换它的左右子节点再入队。\n\n方法三：迭代（DFS，栈）\n用栈模拟递归，同样每个节点交换左右子树。',
    keyDifficulties: '1. 核心操作是「交换左右子树」，对每个节点都要做\n2. 递归顺序：先翻转子树再交换，或先交换再翻转，两者都可行，注意保持一致\n3. 交换时不能直接 root->left = root->right，需要先保存子树（用临时变量）\n4. 递归三要素：终止条件（空节点）、递归调用（左右子树）、处理逻辑（交换）\n5. BFS 迭代法每个节点入队出队一次，配合队列的 FIFO 特性逐层处理',
    createdAt: '2026-07-30T23:00:00'
  },
  {
    id: 15, number: 234, title: '回文链表', titleEn: 'Palindrome Linked List', difficulty: '简单',
    knowledge: ['链表', '快慢指针', '双指针', '迭代'],
    solution: '核心思路：回文 = 前半段顺序与后半段逆序一致。先找中点，反转后半段，再逐节点比较。\n\n方法一：快慢指针找中点 + 反转后半段（最优，O(1) 空间）\n\n具体步骤：\n  第1步 — 快慢指针找中点：\n    slow 每次走 1 步，fast 每次走 2 步\n    fast 到末尾时，slow 正好在中点（偶数长度）或中点前一个（奇数长度）\n  第2步 — 反转后半段：\n    从 slow（或 slow->next）开始反转后半部分链表\n  第3步 — 双指针比较：\n    p1 指向头节点，p2 指向反转后的后半段头，逐个比较节点值\n    全部相等 → 回文，返回 true；中途不等 → false\n\n核心流程：\n  // 找中点\n  ListNode *slow = head, *fast = head;\n  while (fast && fast->next) {\n      slow = slow->next;\n      fast = fast->next->next;\n  }\n  // 反转后半段（从 slow 开始，注意奇数长度时 slow 应再前进一步）\n  ListNode* second = reverse(slow);\n  // 比较两段\n  ListNode* p1 = head, *p2 = second;\n  while (p2) {\n      if (p1->val != p2->val) return false;\n      p1 = p1->next;\n      p2 = p2->next;\n  }\n  return true;\n\n时间复杂度 O(n)，空间复杂度 O(1)。\n\n方法二：复制到数组 + 双指针（简单直观）\n先遍历链表把值存入 vector，再用左右指针判断数组是否回文。\n时间复杂度 O(n)，空间复杂度 O(n)。\n\n方法三：递归（双指针技巧）\n用递归模拟从两端向中间比较，代码优雅但空间 O(n)。',
    keyDifficulties: '1. 组合题：快慢指针找中点 + 反转链表 + 双指针比较，三步环环相扣\n2. 找中点的细节：奇数/偶数长度的边界不同，慢指针可能需要再前进一步\n3. 反转后半段复用第 206 题的迭代三指针法\n4. 比较的终止条件：以反转后的后半段为空为准（p2 非空），前半段可能长一个节点\n5. 面试追问：反转后是否要恢复链表？标准解答通常不要求，但指出这点显得严谨',
    createdAt: '2026-07-31T09:00:00'
  },
  {
    id: 16, number: 283, title: '移动零', titleEn: 'Move Zeroes', difficulty: '简单',
    knowledge: ['vector', '双指针'],
    solution: '核心思路：快慢指针。慢指针 slow 指向「下一个非零元素应放置的位置」，快指针 fast 扫描数组。快指针遇到非零元素就把它交换到 slow 的位置，slow 前移。遍历结束后所有非零元素保持在前面且相对顺序不变，0 自然被挤到末尾。\n\n方法一：快慢指针 + 交换（最优，O(1) 空间）\n\n具体步骤：\n  第1步 — 初始化：\n    int slow = 0;  // 下一个非零元素要放的位置\n  第2步 — 快指针遍历数组：\n    for (int fast = 0; fast < nums.size(); fast++) {\n        if (nums[fast] != 0) {\n            swap(nums[slow], nums[fast]);  // 非零元素放到 slow 处\n            slow++;                        // slow 指向下一个空位\n        }\n    }\n  第3步 — 遍历结束，0 全部在末尾\n\n核心代码：\n  int slow = 0;\n  for (int fast = 0; fast < nums.size(); fast++) {\n      if (nums[fast] != 0) {\n          swap(nums[slow], nums[fast]);\n          slow++;\n      }\n  }\n\n时间复杂度 O(n)，空间复杂度 O(1)，原地操作。\n\n方法二：两次遍历（非零前移 + 末尾补零）\n第一遍把所有非零元素按顺序移到前面；第二遍把剩余位置填 0。\n同样 O(n) 时间 O(1) 空间，但比 swap 多了一次写操作。',
    keyDifficulties: '1. 快慢指针的分工：fast 负责「找非零元素」，slow 负责「放非零元素的位置」\n2. 用 swap 交换而非直接赋值，能天然保证 0 被挪到后面，避免「覆盖丢失」\n3. 非零元素的相对顺序保持不变，因为 fast 从左到右扫描、slow 从左到右填\n4. 边界：数组全为 0 或全非 0 时，swap 不改变数组，代码仍正确\n5. 原地操作要求不能用额外数组，这也是快慢指针法的优势所在',
    createdAt: '2026-07-31T10:00:00'
  },
  {
    id: 17, number: 338, title: '比特位计数', titleEn: 'Counting Bits', difficulty: '简单',
    knowledge: ['动态规划', '位运算', 'vector'],
    solution: '核心思路：动态规划 + 位运算。二进制数中 1 的个数存在递推关系，用已算出的结果推导新结果，O(n) 时间。\n\n方法一：DP + 最低有效位（LSB，推荐）\n\n递推关系：\n  ans[i] = ans[i >> 1] + (i & 1)\n\n推导：\n  i >> 1 表示去掉 i 的最低有效位（右移一位）\n  i & 1 表示 i 的最低位是 0 还是 1\n  所以：i 中 1 的个数 = (去掉最低位后的 1 个数) + (最低位是否为 1)\n\n  例如 i=5 (101)：\n    5 >> 1 = 2 (10)，ans[2] = 1\n    5 & 1 = 1\n    ans[5] = 1 + 1 = 2 ✓\n\n核心代码：\n  vector<int> ans(n + 1, 0);\n  for (int i = 1; i <= n; i++) {\n      ans[i] = ans[i >> 1] + (i & 1);\n  }\n  return ans;\n\n时间复杂度 O(n)，空间复杂度 O(1)（除返回数组外）。\n\n方法二：DP + 最低设置位（lowest set bit）\n  ans[i] = ans[i & (i-1)] + 1\n  i & (i-1) 会清除 i 最低位的 1，所以「i 的 1 个数 = 去掉最低位1后的 1 个数 + 1」\n\n方法三：暴力（每位数位统计）\n对每个 i 循环右移统计 1 的个数，时间复杂度 O(n log n)，不推荐。',
    keyDifficulties: '1. 核心递推：ans[i] = ans[i>>1] + (i&1)，把「数 1」转化为「复用子问题的解」\n2. 为什么 ans[i>>1] 一定已算好：i>>1 < i，按 i 递增顺序计算时子问题已就绪\n3. 三种 DP 思路（LSB / 最高位 / lowest set bit）本质都是「去掉一位 + 补上这一位的贡献」\n4. 题目禁止 __builtin_popcount 等内置函数，考查的就是递推关系\n5. 位运算 + DP 的结合：位运算提供「递推依据」，DP 保证不重复计算',
    createdAt: '2026-07-31T11:00:00'
  },
  {
    id: 18, number: 448, title: '找到所有数组中消失的数字', titleEn: 'Find All Numbers Disappeared in an Array', difficulty: '简单',
    knowledge: ['vector', '原地哈希', '哈希表'],
    solution: '核心思路：原地哈希（用数组本身当哈希表）。因为 nums[i] 在 [1, n] 范围内，可以用「下标」标记「值是否出现过」：值 v 出现时，把下标 v-1 位置的数标记为负。最后哪些位置还是正数，对应的数字 i+1 就没出现过。\n\n方法一：原地哈希（负号标记，最优 O(1) 空间）\n\n具体步骤：\n  第1步 — 第一遍遍历：用负号标记出现过的数字\n    for (int i = 0; i < n; i++) {\n        int v = abs(nums[i]);        // 值可能已被标记为负，先取绝对值\n        nums[v-1] = -abs(nums[v-1]); // 用下标 v-1 标记数字 v 出现过\n    }\n  第2步 — 第二遍遍历：找没被标记（仍为正）的位置\n    vector<int> ans;\n    for (int i = 0; i < n; i++) {\n        if (nums[i] > 0) ans.push_back(i + 1);  // 下标 i 对应数字 i+1\n    }\n  第3步 — 返回 ans\n\n核心代码：\n  for (int i = 0; i < n; i++) nums[abs(nums[i]) - 1] = -abs(nums[abs(nums[i]) - 1]);\n  for (int i = 0; i < n; i++) if (nums[i] > 0) ans.push_back(i + 1);\n\n时间复杂度 O(n)，空间复杂度 O(1)（除返回数组外），不修改原始数据语义（用符号位标记）。\n\n方法二：哈希集合（O(n) 空间）\n把 nums 存入 unordered_set，然后从 1 到 n 检查每个数字是否在集合中。\n\n方法三：交换到对应位置\n循环把 nums[i] 交换到 nums[nums[i]-1]，最后 nums[i] != i+1 的位置就是缺失数字。',
    keyDifficulties: '1. 核心洞察：值域 [1, n] 正好和下标 [0, n-1] 一一对应，数组本身就是天然的哈希表\n2. 取绝对值的关键：因为 nums[i] 可能已被标记为负，必须先 abs 才能拿到原始值\n3. 用负号标记时也要对目标取 abs，防止重复标记导致正负混乱\n4. 第二遍找「仍为正」的下标 i，缺失数字 = i + 1\n5. 时间复杂度 O(n)、空间 O(1) 的原地技巧是本题面试重点，哈希集合 O(n) 空间会被追问',
    createdAt: '2026-07-31T12:00:00'
  },
  {
    id: 19, number: 461, title: '汉明距离', titleEn: 'Hamming Distance', difficulty: '简单',
    knowledge: ['位运算'],
    solution: '核心思路：异或 + 统计 1 的个数。汉明距离 = 两个数字二进制位不同的位置数 = x ^ y 中 1 的个数。\n\n具体步骤：\n  第1步 — 异或：\n    int xor_val = x ^ y;\n    // x ^ y 的二进制中，某一位为 1 表示 x 和 y 在该位不同\n  第2步 — 统计 xor_val 中 1 的个数：\n    int count = 0;\n    while (xor_val) {\n        xor_val &= (xor_val - 1);  // 每轮消除最低位的 1\n        count++;\n    }\n  第3步 — 返回 count\n\n核心代码：\n  int v = x ^ y, count = 0;\n  while (v) { v &= (v - 1); count++; }\n  return count;\n\n核心技巧说明：\n  v & (v-1) 会消除 v 最低位的那一个 1。\n  例如 v = 1010 (10)：\n    v-1 = 1001，v & (v-1) = 1000（最低位的 1 被去掉）\n  每执行一次消掉一个 1，循环次数 = 1 的个数。\n\n时间复杂度 O(1)（最多循环 32 次，因为 int 有 32 位）。\n\n方法二：逐位比较\nfor 循环 32 位，逐位比较 (x>>i & 1) != (y>>i & 1) 累加。\n\n方法三：内置函数\n__builtin_popcount(x ^ y) 一行解决，但面试常要求手动实现。',
    keyDifficulties: '1. 核心转化：汉明距离 = x^y 中 1 的个数，把「比较位」转化为「数位运算结果」\n2. v & (v-1) 是数 1 的最高频技巧：每轮消除最低位的一个 1，循环次数即 1 的个数\n3. 别忘了在 x^y 之后 x、y 本身不会被修改（按值传递）\n4. 位运算优先级低，写 (x >> i) & 1 时括号要加对\n5. 变体：求两个字符串的汉明距离、整个数组两两汉明距离之和（477 题）',
    createdAt: '2026-07-31T13:00:00'
  },
  {
    id: 20, number: 543, title: '二叉树的直径', titleEn: 'Diameter of Binary Tree', difficulty: '简单',
    knowledge: ['二叉树', '深度优先搜索', '递归'],
    solution: '核心思路：DFS 后序遍历。直径 = 任意两个节点间最长路径的边数 = 某节点左子树高度 + 右子树高度的最大值。在递归求子树高度时顺便更新全局最大直径。\n\n递归函数设计：\n  int dfs(TreeNode* node)\n  功能：返回以 node 为根的子树「高度」（从 node 到最远叶子的节点数）\n  副作用：更新全局变量 diameter\n\n递归步骤：\n  第1步 — 边界条件：\n    if (!node) return 0;  // 空节点高度为 0\n  第2步 — 递归求左右子树高度：\n    int left  = dfs(node->left);\n    int right = dfs(node->right);\n  第3步 — 更新全局直径：\n    经过当前节点的最长路径 = left + right（左子树高度 + 右子树高度，单位：边）\n    diameter = max(diameter, left + right);\n  第4步 — 向上返回当前子树的高度：\n    return max(left, right) + 1;  // 加上当前节点这一层\n\n核心代码：\n  int diameter = 0;\n  int dfs(TreeNode* node) {\n      if (!node) return 0;\n      int left = dfs(node->left);\n      int right = dfs(node->right);\n      diameter = max(diameter, left + right);\n      return max(left, right) + 1;\n  }\n\n为什么 left + right 是边数：\n以某个节点为「拐点」的最长路径，从该节点向左走到最深叶子、向右走到最深叶子，\n边的总数 = 左子树高度 + 右子树高度。全局取最大即可（路径可能不经过根节点）。\n\n时间复杂度 O(n)，空间复杂度 O(n)（递归栈深度 = 树高）。',
    keyDifficulties: '1. 关键技巧：递归函数「一箭双雕」——既返回子树高度，又用全局变量更新直径\n2. 直径不一定经过根节点！所以要在每个节点处都更新 diameter，取全局最大\n3. left + right 是「经过该节点的路径边数」，返回给父节点的是「子树高度（节点数）」\n4. 边界：单节点树直径为 0（没有任何边），空树为 0\n5. 与「二叉树的最大深度」区分：最大深度只算一条最长向下的链，直径是两条链拼起来的',
    createdAt: '2026-07-31T14:00:00'
  },
  {
    id: 21, number: 617, title: '合并二叉树', titleEn: 'Merge Two Binary Trees', difficulty: '简单',
    knowledge: ['二叉树', '深度优先搜索', '递归'],
    solution: '核心思路：递归前序遍历，同步处理两棵树的对应节点。两个节点都非空则值相加并递归合并子节点；一个为空则直接返回另一个（它的子树天然保留）。\n\n递归函数设计：\n  TreeNode* mergeTrees(TreeNode* t1, TreeNode* t2)\n  功能：返回合并 t1 和 t2 后的新树根\n\n递归步骤：\n  第1步 — 边界条件（两个空判断，注意顺序）：\n    if (!t1) return t2;  // t1 空 → 返回 t2（t2 的子树原样保留）\n    if (!t2) return t1;  // t2 空 → 返回 t1\n  第2步 — 合并当前节点：\n    TreeNode* node = new TreeNode(t1->val + t2->val);  // 值相加\n  第3步 — 递归合并左右子树：\n    node->left  = mergeTrees(t1->left,  t2->left);\n    node->right = mergeTrees(t1->right, t2->right);\n  第4步 — 返回合并后的节点\n\n核心代码：\n  if (!t1) return t2;\n  if (!t2) return t1;\n  TreeNode* node = new TreeNode(t1->val + t2->val);\n  node->left  = mergeTrees(t1->left,  t2->left);\n  node->right = mergeTrees(t1->right, t2->right);\n  return node;\n\n时间复杂度 O(n)（n = 两树中较小的节点数），空间复杂度 O(n)。\n\n方法二：原地合并（不建新节点）\n直接在 t1 上修改：t1->val += t2->val，递归合并左右子树后返回 t1。\n可以省去 new 节点的开销，但会修改输入树。',
    keyDifficulties: '1. 两个边界判断的顺序：先判断 t1 空再判断 t2 空，哪个为空就返回另一个\n2. 「不为 null 的节点直接作为新节点」对应到代码就是 if (!t1) return t2——直接把整棵子树接过来\n3. 递归时左右子树要同步传参：t1->left 配 t2->left，t1->right 配 t2->right\n4. 创建新树 vs 原地合并的选择：新树不修改输入，原地合并省内存但改数据\n5. 递归天然处理「一个为空另一个非空」的情况，因为直接返回非空的那个就包含其全部子树',
    createdAt: '2026-07-31T15:00:00'
  },
  {
    id: 22, number: 2, title: '两数相加', titleEn: 'Add Two Numbers', difficulty: '中等',
    knowledge: ['链表', '哑节点', '迭代'],
    solution: '核心思路：同时遍历两条链表，模拟「竖式加法」，每一位 = 两个节点值 + 进位，用 carry 记录进位。因为链表是逆序存储（个位在头），从头遍历正好是从低位到高位相加。\n\n具体步骤：\n  第1步 — 初始化：\n    ListNode dummy(0);   // 哑节点，简化结果链表头节点处理\n    ListNode* tail = &dummy;  // 尾指针，用于构建结果链表\n    int carry = 0;       // 进位\n  第2步 — 循环，条件是 l1、l2、carry 任一不为空/不为 0：\n    int sum = carry;\n    if (l1) { sum += l1->val; l1 = l1->next; }  // l1 非空取当前位\n    if (l2) { sum += l2->val; l2 = l2->next; }  // l2 非空取当前位\n    carry = sum / 10;                           // 更新进位\n    tail->next = new ListNode(sum % 10);        // 当前位 = sum % 10\n    tail = tail->next;                          // 尾指针前移\n  第3步 — 返回 dummy.next\n\n核心代码：\n  ListNode dummy(0), *tail = &dummy;\n  int carry = 0;\n  while (l1 || l2 || carry) {\n      int sum = carry;\n      if (l1) { sum += l1->val; l1 = l1->next; }\n      if (l2) { sum += l2->val; l2 = l2->next; }\n      carry = sum / 10;\n      tail->next = new ListNode(sum % 10);\n      tail = tail->next;\n  }\n  return dummy.next;\n\n时间复杂度 O(max(m, n))，空间复杂度 O(1)（除结果链表外）。',
    keyDifficulties: '1. 进位的处理：carry 初始为 0，每位 sum = 两节点值 + carry，更新 carry = sum/10\n2. 循环条件写成 while (l1 || l2 || carry)——不仅处理长度差，还处理「最后多出来的进位」（如 999+1=1000）\n3. 两链表长度不同：短的链表走到尾后 l1/l2 为空，取值为 0，不需要特殊处理\n4. 哑节点简化结果链表的头节点：所有节点统一用 tail->next 追加\n5. 逆序存储是「福利」：链表头就是个位，直接从头到尾加即可，无需反转',
    createdAt: '2026-07-31T16:00:00'
  },
  {
    id: 23, number: 3, title: '无重复字符的最长子串', titleEn: 'Longest Substring Without Repeating Characters', difficulty: '中等',
    knowledge: ['滑动窗口', '双指针', 'unordered_map'],
    solution: '核心思路：滑动窗口 + 哈希表。维护一个 [left, right] 的窗口，窗口内字符不重复；right 向右扩张，遇到重复字符时把 left 跳到「上一个重复字符的下一位」，全程记录窗口最大长度。\n\n具体步骤：\n  第1步 — 初始化：\n    int left = 0, maxLen = 0;\n    unordered_map<char, int> lastIndex;  // 字符 → 最近一次出现的下标\n  第2步 — 右指针向右遍历：\n    for (int right = 0; right < s.size(); right++) {\n        char c = s[right];\n        若 c 已在窗口中出现过（lastIndex 中有记录）：\n            left = max(left, lastIndex[c] + 1);  // left 跳到重复字符的下一位\n        lastIndex[c] = right;          // 更新 c 最近出现的位置\n        maxLen = max(maxLen, right - left + 1);  // 更新最大窗口长度\n    }\n  第3步 — 返回 maxLen\n\n核心代码：\n  int left = 0, maxLen = 0;\n  unordered_map<char, int> lastIndex;\n  for (int right = 0; right < s.size(); right++) {\n      if (lastIndex.count(s[right])) {\n          left = max(left, lastIndex[s[right]] + 1);\n      }\n      lastIndex[s[right]] = right;\n      maxLen = max(maxLen, right - left + 1);\n  }\n  return maxLen;\n\n为什么用 max(left, ...)：\nleft 只能向右移动，不能回退。lastIndex[c] 可能是很早以前的位置，\n用 max 确保 left 不会往左走。\n\n时间复杂度 O(n)（每个字符最多被左右指针各访问一次），空间复杂度 O(字符集大小)。',
    keyDifficulties: '1. 滑动窗口模板：右指针扩张、左指针收缩、窗口内维护「有效状态」、更新答案\n2. 遇到重复字符时 left = max(left, lastIndex[c] + 1)——left 只增不减，避免回退\n3. 用 unordered_map 记录「字符最近出现下标」，比 set 更高效（直接知道跳到哪里）\n4. 更新 lastIndex[c] 要在 left 调整之后，保证记录的是最新位置\n5. 边界：空字符串返回 0，单字符返回 1',
    createdAt: '2026-07-31T17:00:00'
  },
  {
    id: 24, number: 5, title: '最长回文子串', titleEn: 'Longest Palindromic Substring', difficulty: '中等',
    knowledge: ['中心扩展法', '双指针', '动态规划'],
    solution: '核心思路：中心扩展法。回文串关于中心对称，枚举所有可能的「中心」，从中心向两边扩展，找到以该中心为轴的最长回文，取全局最大。\n\n方法一：中心扩展法（推荐，O(n²) 时间 O(1) 空间）\n\n核心代码：\n  int expand(const string& s, int l, int r) {\n      while (l >= 0 && r < s.size() && s[l] == s[r]) { l--; r++; }\n      return r - l - 1;                        // 回文长度\n  }\n  int start = 0, maxLen = 0;\n  for (int i = 0; i < s.size(); i++) {\n      int len1 = expand(s, i, i);              // 奇数回文（中心是字符）\n      int len2 = expand(s, i, i + 1);          // 偶数回文（中心是字符间隙）\n      int len = max(len1, len2);\n      if (len > maxLen) { maxLen = len; start = i - (len - 1) / 2; }\n  }\n  return s.substr(start, maxLen);\n\n说明：共 2n-1 个回文中心（n 个字符 + n-1 个间隙），每个向两边扩展。\n时间复杂度 O(n²)，空间复杂度 O(1)。\n\n方法二：动态规划（O(n²) 时间 O(n²) 空间）\n\n核心代码：\n  int n = s.size();\n  vector<vector<bool>> dp(n, vector<bool>(n, false));\n  int start = 0, maxLen = 1;\n  for (int i = 0; i < n; i++) dp[i][i] = true;      // 长度为 1 都是回文\n  for (int i = 0; i + 1 < n; i++) {                  // 长度为 2\n      if (s[i] == s[i+1]) { dp[i][i+1] = true; start = i; maxLen = 2; }\n  }\n  for (int len = 3; len <= n; len++) {               // 长度从 3 开始\n      for (int i = 0; i + len - 1 < n; i++) {\n          int j = i + len - 1;\n          if (s[i] == s[j] && dp[i+1][j-1]) {        // 状态转移\n              dp[i][j] = true;\n              if (len > maxLen) { maxLen = len; start = i; }\n          }\n      }\n  }\n  return s.substr(start, maxLen);\n\n状态转移：dp[i][j] = (s[i] == s[j]) && dp[i+1][j-1]。\n遍历顺序：按长度 len 从小到大（因为 dp[i][j] 依赖更短的 dp[i+1][j-1]）。\n\n方法三：Manacher 算法（O(n) 时间，进阶）\n利用回文半径的对称性质（镜像复用已算出的回文半径），线性时间求解。\n实现较复杂，面试中以中心扩展法或 DP 为主，Manacher 了解思想即可。',
    keyDifficulties: '1. 回文中心有 2n-1 个：n 个字符中心 + n-1 个字符间隙中心，都要枚举\n2. expand 返回长度 r-l-1：扩展结束后 l、r 已越出回文边界，长度 = (r-1)-(l+1)+1 = r-l-1\n3. 计算回文起点 start = i - (len-1)/2（len 为奇数/偶数时起点公式一致）\n4. 单字符、双字符回文的中心不同：中心扩展法天然覆盖，无需特判\n5. 进阶：Manacher 算法 O(n)，但面试通常中心扩展法已够用',
    createdAt: '2026-07-31T18:00:00'
  },
  {
    id: 25, number: 11, title: '盛最多水的容器', titleEn: 'Container With Most Water', difficulty: '中等',
    knowledge: ['双指针', 'vector'],
    solution: '核心思路：对撞双指针。左右指针分别指向数组两端，计算当前容器的水量，然后移动「较短的那条边」，直到两指针相遇。\n\n方法一：对撞双指针（最优，O(n) 时间 O(1) 空间）\n\n核心代码：\n  int left = 0, right = height.size() - 1;\n  int maxWater = 0;\n  while (left < right) {\n      int h = min(height[left], height[right]);  // 水位由较短边决定\n      int w = right - left;                       // 宽度\n      maxWater = max(maxWater, h * w);            // 更新最大水量\n      if (height[left] < height[right]) left++;   // 移动较短的那条边\n      else right--;\n  }\n  return maxWater;\n\n为什么移动较短的边：\n容器面积 = min(h[left], h[right]) * (right - left)。\n若移动较长的边，宽度变小，而高度仍受较短边限制不会增大，面积不可能变大；\n只有移动较短的边，才有可能遇到更高的边让面积增大。\n\n复杂度：时间 O(n)（每个位置最多被访问一次），空间 O(1)。\n\n方法二：暴力枚举（O(n²)）\n双重循环枚举所有 (i, j) 组合计算面积取最大。超时，仅作思路参考。',
    keyDifficulties: '1. 对撞双指针的核心：每次移动「较短边」——这是正确性证明的关键，移动较长边面积必不增\n2. 水量由 min(height[left], height[right]) 决定（短板效应），宽度是下标之差\n3. 循环终止条件是 left < right，相遇即结束\n4. 面积 = 高度 × 宽度，注意 h 取的是两条边的较小值\n5. 与「接雨水」区分：盛水容器是选两条线围成矩形，接雨水是计算中间洼地能存多少',
    createdAt: '2026-07-31T19:00:00'
  },
  {
    id: 26, number: 15, title: '三数之和', titleEn: '3Sum', difficulty: '中等',
    knowledge: ['双指针', 'vector', '排序'],
    solution: '核心思路：排序 + 对撞双指针。先排序让数组有序，固定第一个数 nums[i]，再用双指针在 i 右侧找两个数使三数之和为 0（即两数之和为 -nums[i]），同时跳过重复元素保证不重复。\n\n方法一：排序 + 双指针（最优，O(n²) 时间 O(1) 额外空间）\n\n核心代码：\n  sort(nums.begin(), nums.end());\n  vector<vector<int>> res;\n  int n = nums.size();\n  for (int i = 0; i < n - 2; i++) {\n      if (nums[i] > 0) break;                    // 剪枝：排序后首位>0，后面全正，不可能和为0\n      if (i > 0 && nums[i] == nums[i-1]) continue;  // 跳过重复的固定元素\n      int left = i + 1, right = n - 1, target = -nums[i];\n      while (left < right) {\n          int sum = nums[left] + nums[right];\n          if (sum == target) {\n              res.push_back({nums[i], nums[left], nums[right]});\n              while (left < right && nums[left] == nums[left+1]) left++;   // 跳重复\n              while (left < right && nums[right] == nums[right-1]) right--; // 跳重复\n              left++; right--;\n          } else if (sum < target) left++;\n          else right--;\n      }\n  }\n  return res;\n\n去重三处要点：\n1. 固定元素去重：i > 0 且 nums[i] == nums[i-1] 时跳过\n2. 找到一组后，left/right 跳过相邻重复\n3. 剪枝：排序后 nums[i] > 0 直接 break\n\n复杂度：时间 O(n²)，空间 O(1)（不计排序和答案数组）。\n\n方法二：暴力枚举（O(n³)）\n三重循环枚举所有三元组 + 去重。超时，仅作思路参考。',
    keyDifficulties: '1. 必须先排序：排序是双指针能工作的前提，也是去重的基础\n2. 去重三处缺一不可：固定元素去重、找到答案后 left/right 去重、还有剪枝\n3. 目标转化为两数之和：对每个 i，在 i 右侧找两数之和 = -nums[i]\n4. 剪枝优化：nums[i] > 0 时直接 break（有序数组后面全正）\n5. 注意 i 的边界是 i < n-2（至少要留两个位置给 left 和 right）',
    createdAt: '2026-07-31T20:00:00'
  },
  {
    id: 27, number: 17, title: '电话号码的字母组合', titleEn: 'Letter Combinations of a Phone Number', difficulty: '中等',
    knowledge: ['回溯算法', '递归', 'vector'],
    solution: '核心思路：回溯（DFS）。每个数字对应一组字母，从第一个数字开始，逐个选择字母加入组合，递归处理下一个数字，递归返回后撤销选择（回溯），穷举所有组合。\n\n方法一：回溯法（DFS，推荐）\n\n核心代码：\n  string mapping[10] = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};\n  vector<string> res;\n  string path;\n  void backtrack(const string& digits, int index) {\n      if (index == digits.size()) {   // 递归终止：处理完所有数字\n          res.push_back(path);\n          return;\n      }\n      string letters = mapping[digits[index] - \'0\'];  // 当前数字对应的字母\n      for (char c : letters) {\n          path.push_back(c);          // 选择\n          backtrack(digits, index + 1); // 递归处理下一个数字\n          path.pop_back();            // 撤销选择（回溯）\n      }\n  }\n  backtrack(digits, 0);\n  return res;\n\n递归过程示例（digits = "23"）：\n  第一层选 \'a\' → 第二层选 \'d\' → 得到 "ad"，回溯\n  → 第二层选 \'e\' → "ae"，回溯 ... 依次穷举所有 3×3 = 9 种组合。\n\n复杂度：时间 O(4^n)（每个数字最多对应 4 个字母），空间 O(n)（递归栈深度）。\n\n方法二：迭代（队列/BFS）\n从空串开始，每读一个数字，把当前所有组合分别拼接该数字的所有字母，生成新组合集合。\n\n核心代码：\n  vector<string> res = {\"\"};\n  for (char d : digits) {\n      vector<string> next;\n      for (const string& s : res)\n          for (char c : mapping[d - \'0\'])\n              next.push_back(s + c);\n      res = next;\n  }\n  return res;',
    keyDifficulties: '1. 回溯模板三件套：选择 → 递归 → 撤销选择（push → 递归 → pop）\n2. 递归终止条件：index == digits.size() 时把当前 path 加入结果\n3. 数字到字母的映射表 mapping 是核心数据结构，注意 0、1 不对应任何字母（留空串）\n4. 每个数字的字母数是固定的（3 或 4），穷举所有组合即可\n5. 回溯法的本质是 DFS + 状态恢复，模板适用于全排列、组合、子集等问题',
    createdAt: '2026-07-31T21:00:00'
  },
  {
    id: 28, number: 19, title: '删除链表的倒数第 N 个结点', titleEn: 'Remove Nth Node From End of List', difficulty: '中等',
    knowledge: ['链表', '快慢指针', '哑节点'],
    solution: '核心思路：快慢指针 + 哑节点。快指针先走 n+1 步，然后快慢指针同步走，快指针到末尾时慢指针恰好停在待删除节点的前一个，直接执行删除。哑节点用于统一处理「删除头节点」的边界。\n\n方法一：快慢指针 + 哑节点（最优，一次遍历 O(n) 时间 O(1) 空间）\n\n核心代码：\n  ListNode dummy(0, head);   // 哑节点，next 指向 head\n  ListNode *fast = &dummy, *slow = &dummy;\n  for (int i = 0; i <= n; i++) fast = fast->next;  // fast 先走 n+1 步\n  while (fast) {              // 快慢同步走，直到 fast 为 null\n      fast = fast->next;\n      slow = slow->next;\n  }\n  slow->next = slow->next->next;  // 删除 slow 后面的节点\n  return dummy.next;\n\n为什么 fast 走 n+1 步：\n倒数第 n 个节点，其前一个节点与末尾相距 n+1 步。\nfast 先走 n+1 步，再与 slow 同步走到末尾，slow 就停在待删节点的前一个。\n\n复杂度：时间 O(n)（一次遍历），空间 O(1)。\n\n方法二：两次遍历\n第一次遍历求链表长度 len，第二次遍历走到第 len-n 个节点删除。\n时间 O(n)，但需要两遍，代码略繁琐。\n\n方法三：栈\n把节点全部入栈，弹栈 n 次后栈顶即待删节点的前一个。\n时间 O(n)，空间 O(n)。',
    keyDifficulties: '1. 哑节点的关键作用：当待删除的是头节点时（n == 链表长度），slow 从 dummy 出发才能正确删除\n2. fast 先走 n+1 步而不是 n 步：这样 slow 停在「前一个」节点而非待删节点本身\n3. 删除操作 slow->next = slow->next->next 前，确认 slow->next 非空\n4. 返回 dummy.next 而不是 head：如果删除了原头节点，head 已经失效\n5. 一次遍历 + O(1) 空间是本题最优解，两次遍历和栈法都会被追问优化',
    createdAt: '2026-07-31T22:00:00'
  },
  {
    id: 29, number: 22, title: '括号生成', titleEn: 'Generate Parentheses', difficulty: '中等',
    knowledge: ['回溯算法', '递归', 'stack'],
    solution: '核心思路：回溯（DFS）。维护两个计数器 open（已放左括号数）和 close（已放右括号数），每次可以放 "(" 当 open < n，放 ")" 当 close < open（保证右括号不超过左括号，从而始终有效），当总长度达到 2n 时记录答案。\n\n方法一：回溯法（推荐）\n\n核心代码：\n  vector<string> res;\n  void backtrack(int open, int close, int n, string& cur) {\n      if (cur.size() == 2 * n) {      // 终止：左右括号都用完\n          res.push_back(cur);\n          return;\n      }\n      if (open < n) {                 // 还能放左括号\n          cur.push_back(\'(\');\n          backtrack(open + 1, close, n, cur);\n          cur.pop_back();             // 回溯\n      }\n      if (close < open) {             // 还能放右括号（右括号数必须 < 左括号数）\n          cur.push_back(\')\');\n          backtrack(open, close + 1, n, cur);\n          cur.pop_back();             // 回溯\n      }\n  }\n  backtrack(0, 0, n, cur);\n  return res;\n\n为什么 close < open 保证有效：\n任何时候右括号数量都不能超过左括号数量，否则会出现「)(」这种非法前缀。\n这个条件从根上避免了生成非法组合，无需最后再校验。\n\n复杂度：时间 O(4^n / √n)（卡特兰数），空间 O(n)（递归栈）。\n\n方法二：暴力枚举 + 校验\n生成所有 2^(2n) 个括号串，逐个判断是否有效（用栈或计数器）。\n时间 O(2^(2n)·n)，效率低。\n\n方法三：动态规划\ndp[i] 表示 i 对括号的所有组合：\n  dp[i] = "(" + dp[j] + ")" + dp[i-1-j]，j 从 0 到 i-1\n递归地拆分，思想类似分治。',
    keyDifficulties: '1. 核心约束：放右括号的条件是 close < open，这保证生成的每一步都是「有效前缀」\n2. 两个可放分支（左/右）都要回溯，不能只走一个方向\n3. 终止条件是 cur.size() == 2*n 而不是 open == n && close == n（等价但前者更直观）\n4. 回溯模板：选择 → 递归 → 撤销，两个分支共用同一个 cur 字符串\n5. 组合总数是卡特兰数 C(2n,n)/(n+1)，结果数量与 n 的关系是超指数增长',
    createdAt: '2026-07-31T23:00:00'
  },
  {
    id: 30, number: 31, title: '下一个排列', titleEn: 'Next Permutation', difficulty: '中等',
    knowledge: ['vector', '排序'],
    solution: '核心思路：标准「下一个排列」三步算法。从右往左找到第一个「升序对」位置 i，再从右往左找到第一个比 nums[i] 大的数 j 交换，最后把 i 之后的序列反转成升序。\n\n具体步骤：\n  第1步 — 找转折点：从右往左找第一个 nums[i] < nums[i+1] 的位置 i\n    （i 右侧的序列是降序的，已经是最大的排列）\n  第2步 — 找交换点：从右往左找第一个 nums[j] > nums[i] 的位置 j\n  第3步 — 交换 nums[i] 和 nums[j]\n  第4步 — 反转 i+1 到末尾（把降序变成升序，得到最小后缀）\n  若第 1 步找不到 i（整个数组降序），直接反转整个数组。\n\n核心代码：\n  void nextPermutation(vector<int>& nums) {\n      int i = nums.size() - 2;\n      while (i >= 0 && nums[i] >= nums[i+1]) i--;   // ① 找升序对\n      if (i >= 0) {\n          int j = nums.size() - 1;\n          while (j > i && nums[j] <= nums[i]) j--;  // ② 找交换点\n          swap(nums[i], nums[j]);                    // ③ 交换\n      }\n      reverse(nums.begin() + i + 1, nums.end());     // ④ 反转后缀\n  }\n\n举例（nums = [1,2,3]）：\n  ① i=1（2<3），② j=2（3>2），③ 交换 → [1,3,2]，④ 反转后缀（从2开始，只有一个元素）→ [1,3,2] ✓\n\n复杂度：时间 O(n)，空间 O(1)。',
    keyDifficulties: '1. 找转折点 i 的条件是 nums[i] < nums[i+1]，i 右侧是「降序区」（已经是该后缀的最大排列）\n2. 找交换点 j 的条件是 nums[j] > nums[i]，且从右往左找第一个（最接近的更大值）\n3. 交换后必须反转 i+1 之后的部分，把它从降序变成升序，得到「刚好大一点」的下一个排列\n4. 边界：整个数组降序时（如 [3,2,1]），无下一个排列，反转整个数组得最小排列 [1,2,3]\n5. 注意用 >= 和 <= 处理重复元素：跳过相等的，避免死循环',
    createdAt: '2026-08-01T09:00:00'
  },
  {
    id: 31, number: 33, title: '搜索旋转排序数组', titleEn: 'Search in Rotated Sorted Array', difficulty: '中等',
    knowledge: ['二分查找', 'vector'],
    solution: '核心思路：变形的二分查找。旋转数组被「断点」分成两段，每段各自升序。每次二分时，mid 会把数组分成左右两半，其中**至少有一半是有序的**，判断 target 是否落在有序的那一半中，从而决定去哪一半继续搜。\n\n核心代码：\n  int search(vector<int>& nums, int target) {\n      int left = 0, right = nums.size() - 1;\n      while (left <= right) {\n          int mid = left + (right - left) / 2;\n          if (nums[mid] == target) return mid;\n          if (nums[left] <= nums[mid]) {      // 左半部分有序\n              if (nums[left] <= target && target < nums[mid])\n                  right = mid - 1;            // target 在左半\n              else\n                  left = mid + 1;             // target 在右半\n          } else {                            // 右半部分有序\n              if (nums[mid] < target && target <= nums[right])\n                  left = mid + 1;             // target 在右半\n              else\n                  right = mid - 1;            // target 在左半\n          }\n      }\n      return -1;\n  }\n\n判断逻辑拆解：\n  ① 若 nums[left] <= nums[mid]：左半段 [left, mid] 完全有序\n     - target 在 [nums[left], nums[mid]) 范围内 → 去左半搜\n     - 否则 → 去右半搜\n  ② 否则：右半段 [mid, right] 完全有序\n     - target 在 (nums[mid], nums[right]] 范围内 → 去右半搜\n     - 否则 → 去左半搜\n\n复杂度：时间 O(log n)，空间 O(1)。',
    keyDifficulties: '1. 核心洞察：mid 把旋转数组分成两半，其中至少一半是有序的，这是缩小搜索范围的关键\n2. 判断哪一半有序：比较 nums[left] 和 nums[mid]（左半有序的条件是 nums[left] <= nums[mid]）\n3. 注意边界：比较时左半用 target < nums[mid]（不含等号），右半用 target <= nums[right]（含等号），避免死循环\n4. mid 计算用 left + (right-left)/2 防溢出\n5. 变体：若数组含重复元素（81 题），nums[left]==nums[mid]==nums[right] 时无法判断哪半有序，需要 left++ 跳过',
    createdAt: '2026-08-01T10:00:00'
  },
  {
    id: 32, number: 34, title: '在排序数组中查找元素的第一个和最后一个位置', titleEn: 'Find First and Last Position of Element in Sorted Array', difficulty: '中等',
    knowledge: ['二分查找', 'vector'],
    solution: '核心思路：两次二分查找，分别找左边界和右边界。用同一个二分函数，通过一个布尔参数控制「找到 target 后是继续向左收缩还是向右收缩」。\n\n方法一：两次二分查找（推荐）\n\n核心代码：\n  // findLeft=true 找最左边的 target；findLeft=false 找最右边的 target\n  int binarySearch(vector<int>& nums, int target, bool findLeft) {\n      int left = 0, right = nums.size() - 1, result = -1;\n      while (left <= right) {\n          int mid = left + (right - left) / 2;\n          if (nums[mid] < target) left = mid + 1;\n          else if (nums[mid] > target) right = mid - 1;\n          else {\n              result = mid;             // 记录找到的位置\n              if (findLeft) right = mid - 1;  // 继续往左找\n              else left = mid + 1;            // 继续往右找\n          }\n      }\n      return result;\n  }\n\n  vector<int> searchRange(vector<int>& nums, int target) {\n      int left = binarySearch(nums, target, true);   // 左边界\n      int right = binarySearch(nums, target, false); // 右边界\n      if (left == -1) return {-1, -1};               // 没找到\n      return {left, right};\n  }\n\n关键：找到 target 后不立即返回，而是继续收缩区间找边界。\n复杂度：时间 O(log n)，空间 O(1)。\n\n方法二：C++ STL lower_bound / upper_bound\n  auto lo = lower_bound(nums.begin(), nums.end(), target); // 第一个 >= target\n  auto hi = upper_bound(nums.begin(), nums.end(), target); // 第一个 > target\n  if (lo == nums.end() || *lo != target) return {-1, -1};\n  return {(int)(lo - nums.begin()), (int)(hi - nums.begin()) - 1};',
    keyDifficulties: '1. 找到 target 后不能立即返回：要判断是找左边界（继续 right=mid-1）还是右边界（继续 left=mid+1）\n2. 用同一个二分函数 + findLeft 参数避免写两遍几乎相同的代码\n3. 边界判断：左边界为 -1 说明不存在 target，直接返回 {-1,-1}\n4. STL 写法注意：lower_bound 返回的是迭代器，转下标用 lo - nums.begin()，右边界要减 1\n5. 空数组 / target 不在范围内：二分自然返回 -1，无需特判',
    createdAt: '2026-08-01T11:00:00'
  },
  {
    id: 33, number: 39, title: '组合总和', titleEn: 'Combination Sum', difficulty: '中等',
    knowledge: ['回溯算法', 'vector', '排序'],
    solution: '核心思路：回溯（DFS）。先排序以便剪枝，从 start 位置开始枚举候选数字，加入组合后递归求解剩余 target（target - candidates[i]）。因为数字可重复选取，递归的 start 传 i 而不是 i+1。\n\n方法一：回溯法（推荐）\n\n核心代码：\n  vector<vector<int>> res;\n  vector<int> path;\n  void backtrack(vector<int>& candidates, int target, int start) {\n      if (target == 0) {              // 正好凑齐 target\n          res.push_back(path);\n          return;\n      }\n      for (int i = start; i < candidates.size(); i++) {\n          if (candidates[i] > target) break;  // 剪枝：排序后当前数 > 剩余 target，后面的更大，直接跳出\n          path.push_back(candidates[i]);      // 选择\n          backtrack(candidates, target - candidates[i], i);  // 递归，i 不变（可重复选同一个数）\n          path.pop_back();                    // 回溯\n      }\n  }\n  sort(candidates.begin(), candidates.end());  // 先排序，配合剪枝\n  backtrack(candidates, target, 0);\n  return res;\n\n举例（candidates=[2,3,6,7], target=7）：\n  选 2 → 剩 5 → 再选 2 → 剩 3 → ... 最终得到 [2,2,3]、[7] 等组合。\n\n为什么 start 传 i 不传 i+1：\n因为同一个数字可以无限次重复选取。传 i 表示「当前数字还可以继续选」。\n而为了不重复组合，不允许回头选下标更小的数，所以 start 从 i 开始。\n\n复杂度：时间 O(n^(target/min))（回溯树的规模），空间 O(target/min)（递归深度）。',
    keyDifficulties: '1. 关键区别：数字可无限重复 → 递归传 start = i（而非 i+1），这是与「组合总和 II」最大的不同\n2. 去重思路：start 参数保证「只往前看」，避免出现 [2,3] 和 [3,2] 这种重复组合\n3. 剪枝优化：先排序，若 candidates[i] > target 直接 break（后面的数更大，更不可能）\n4. 用「剩余 target」作为递归参数比维护 sum 更简洁，target 减到 0 即找到一组\n5. 变体：组合总和 II（40 题）每个数只能用一次 → start 传 i+1 + 去重跳过相邻重复',
    createdAt: '2026-08-01T12:00:00'
  },
  {
    id: 34, number: 46, title: '全排列', titleEn: 'Permutations', difficulty: '中等',
    knowledge: ['回溯算法', 'vector'],
    solution: '核心思路：回溯（DFS）。排列关心顺序，所以每层都从下标 0 开始尝试所有「还没用过」的元素（用 used 数组标记），当路径长度达到 n 时记录排列。\n\n方法一：回溯 + used 数组（推荐）\n\n核心代码：\n  vector<vector<int>> res;\n  vector<int> path;\n  vector<bool> used;\n  void backtrack(vector<int>& nums) {\n      if (path.size() == nums.size()) {   // 所有元素都用完了\n          res.push_back(path);\n          return;\n      }\n      for (int i = 0; i < nums.size(); i++) {\n          if (used[i]) continue;          // 已用过的元素跳过\n          used[i] = true;\n          path.push_back(nums[i]);        // 选择\n          backtrack(nums);                // 递归\n          path.pop_back();                // 回溯\n          used[i] = false;\n      }\n  }\n  used.resize(nums.size(), false);\n  backtrack(nums);\n  return res;\n\n与组合问题的区别：\n- 组合：关心「选哪些」，用 start 参数保证顺序（不重复）\n- 排列：关心「顺序」，每层都从 0 开始，用 used 数组防止重复选同一个元素\n\n复杂度：时间 O(n × n!)，空间 O(n)（递归深度）。\n\n方法二：交换法（原地排列）\n把每个元素依次换到 start 位置，递归排列后面部分，再换回来。\n  void backtrack(vector<int>& nums, int start) {\n      if (start == nums.size()) { res.push_back(nums); return; }\n      for (int i = start; i < nums.size(); i++) {\n          swap(nums[start], nums[i]);\n          backtrack(nums, start + 1);\n          swap(nums[start], nums[i]);\n      }\n  }\n时间同样 O(n × n!)，但省去 used 数组和 path 的空间。',
    keyDifficulties: '1. 与组合的关键区别：排列关心顺序，每层从下标 0 开始枚举，用 used 数组防止重复选同一元素\n2. used 数组必须随递归同步回溯：进入递归前标记 true，返回后恢复 false\n3. 终止条件：path.size() == nums.size()，即所有元素都排进去了\n4. 交换法更省空间，但会修改原数组 nums，理解「换进去、递归、换回来」的模式\n5. 变体：全排列 II（47 题）有重复元素 → 排序 + 同一层跳过相邻重复，避免重复排列',
    createdAt: '2026-08-01T13:00:00'
  },
  {
    id: 35, number: 48, title: '旋转图像', titleEn: 'Rotate Image', difficulty: '中等',
    knowledge: ['vector', '矩阵操作'],
    solution: '核心思路：原地顺时针旋转 90°，两种经典做法。关键都是不借助额外矩阵，只做元素交换。\n\n方法一：转置 + 反转每一行（推荐，好记）\n\n顺时针旋转 90° = 先转置（沿主对角线翻转）+ 再反转每一行。\n\n核心代码：\n  void rotate(vector<vector<int>>& matrix) {\n      int n = matrix.size();\n      // ① 转置：matrix[i][j] 与 matrix[j][i] 互换\n      for (int i = 0; i < n; i++) {\n          for (int j = i + 1; j < n; j++) {\n              swap(matrix[i][j], matrix[j][i]);\n          }\n      }\n      // ② 反转每一行\n      for (int i = 0; i < n; i++) {\n          reverse(matrix[i].begin(), matrix[i].end());\n      }\n  }\n\n为什么正确：\n转置把 matrix[i][j] 移到 matrix[j][i]（行列互换）；\n再反转每行，相当于把列镜像一下，组合起来正好是顺时针 90°。\n\n方法二：逐层四元素循环旋转（一次到位）\n从外到内一层层处理，每层四个角围成一个环，循环交换四个元素。\n  for (int i = 0; i < n / 2; i++) {          // 层\n      for (int j = i; j < n - 1 - i; j++) {   // 该层内的位置\n          int temp = matrix[i][j];\n          matrix[i][j] = matrix[n-1-j][i];\n          matrix[n-1-j][i] = matrix[n-1-i][n-1-j];\n          matrix[n-1-i][n-1-j] = matrix[j][n-1-i];\n          matrix[j][n-1-i] = temp;\n      }\n  }\n\n复杂度：两种方法都 O(n²) 时间，O(1) 空间（原地）。',
    keyDifficulties: '1. 方法一的核心是记住公式：顺时针90° = 转置 + 反转每行；逆时针90° = 转置 + 反转每列\n2. 转置时内层循环 j 从 i+1 开始，避免重复交换（交换两次会换回原样）\n3. 四元素旋转法的下标容易写错，建议用 3×3 矩阵画图推一遍四个角的交换顺序\n4. 原地要求：不能用另一个矩阵，所以只能用 swap 交换元素\n5. 边界：n 为奇数时最中心元素不动，只需处理 n/2 层',
    createdAt: '2026-08-01T16:00:00'
  },
  {
    id: 36, number: 49, title: '字母异位词分组', titleEn: 'Group Anagrams', difficulty: '中等',
    knowledge: ['unordered_map', '哈希表', 'vector'],
    solution: '核心思路：字母异位词「排序后完全相同」。把每个字符串的「规范形式」作为哈希表的 key，把相同 key 的字符串归到同一组。\n\n方法一：排序字符串作为 key（推荐，简洁）\n\n核心代码：\n  vector<vector<string>> groupAnagrams(vector<string>& strs) {\n      unordered_map<string, vector<string>> mp;\n      for (string& s : strs) {\n          string key = s;\n          sort(key.begin(), key.end());   // 排序后得到规范形式\n          mp[key].push_back(s);           // 相同异位词分到同一组\n      }\n      vector<vector<string>> res;\n      for (auto& p : mp) res.push_back(p.second);\n      return res;\n  }\n\n举例：strs = ["eat", "tea", "tan", "ate", "nat", "bat"]\n  "eat"/"tea"/"ate" 排序后都是 "aet" → 一组\n  "tan"/"nat" 排序后都是 "ant" → 一组\n  "bat" 排序后是 "abt" → 一组\n\n复杂度：时间 O(N × L log L)（N 个字符串，每个排序 L 长度），空间 O(N×L)。\n\n方法二：字符计数作为 key（优化，O(N×L)）\n不用排序，统计每个字母出现次数拼成 key（如 "a1e1t1"）。\n  string getKey(const string& s) {\n      vector<int> count(26, 0);\n      for (char c : s) count[c - \'a\']++;\n      string key;\n      for (int i = 0; i < 26; i++) {\n          key += char(\'a\' + i);\n          key += to_string(count[i]);\n      }\n      return key;\n  }\n省去排序，但拼 key 的常数较大，实际两者性能相近。',
    keyDifficulties: '1. 核心洞察：异位词排序后相同，用「排序结果」作为哈希 key 是这类题的通用套路\n2. unordered_map<string, vector<string>> 的 value 存一组字符串，哈希值直接分组\n3. 方法二用计数数组拼 key（"a1e1t1"）可省排序，适用于对时间敏感的场景\n4. 注意 key 要能唯一标识异位词组：排序法天然保证，计数法要包含所有 26 个字母的计数\n5. 变体：找「同字母异序词对」（242 题验证两个词是否异位词）本质也是比较规范形式',
    createdAt: '2026-08-01T17:00:00'
  },
  {
    id: 37, number: 55, title: '跳跃游戏', titleEn: 'Jump Game', difficulty: '中等',
    knowledge: ['贪心算法', 'vector', '动态规划'],
    solution: '核心思路：贪心。维护 maxReach（从已遍历位置能跳到的最远下标），遍历每个位置：若当前位置已经超过了 maxReach，说明中间有无法跨越的断点，返回 false；否则用 nums[i] 更新 maxReach，一旦 maxReach 能到末尾就返回 true。\n\n方法一：贪心（最优，O(n) 时间 O(1) 空间）\n\n核心代码：\n  bool canJump(vector<int>& nums) {\n      int maxReach = 0;                     // 能跳到的最远下标\n      for (int i = 0; i < nums.size(); i++) {\n          if (i > maxReach) return false;   // 到不了当前位置 → 卡住了\n          maxReach = max(maxReach, i + nums[i]);  // 更新最远可达\n          if (maxReach >= nums.size() - 1) return true;  // 能到末尾\n      }\n      return true;\n  }\n\n关键洞察：\n不需要真正模拟每一步怎么跳，只需要维护「从前面所有位置出发，最远能到哪」。\n如果某个位置 i 已经超出 maxReach，说明它前面所有位置都跳不到 i，必然失败。\n\n复杂度：时间 O(n)，空间 O(1)。\n\n方法二：动态规划（O(n²)）\ndp[i] 表示能否到达 i，dp[i] = true 当存在 j<i 且 dp[j] && j+nums[j]>=i。\n时间 O(n²)，空间 O(n)，比贪心慢，仅作对比。\n\n变体：跳跃游戏 II（45 题）求最小步数，需要用「每次跳到当前区间内能跳最远的位置」的贪心策略。',
    keyDifficulties: '1. 核心贪心变量：maxReach 记录「从已遍历位置能到达的最远下标」，不断更新取最大\n2. 判断失败的条件：i > maxReach（当前位置不可达）——这是贪心正确性的关键\n3. 一旦 maxReach >= n-1 立即返回 true，可以提前退出\n4. 注意 nums[i] 是「最大跳跃长度」不是「必须跳的长度」，所以是取 max\n5. 与 45 题跳跃游戏 II 区分：本题只问「能否到」，贪心一遍即可；45 题问「最少几步」，需分层贪心',
    createdAt: '2026-08-01T18:00:00'
  },
  {
    id: 38, number: 56, title: '合并区间', titleEn: 'Merge Intervals', difficulty: '中等',
    knowledge: ['排序', 'vector', '贪心算法'],
    solution: '核心思路：排序 + 贪心。先把区间按起点升序排序，这样有重叠的区间一定相邻。遍历时比较当前区间与「结果中最后一个区间」：若起点 <= 已合并区间的终点则重叠，合并（终点取较大值）；否则作为一个新区间加入结果。\n\n方法一：排序 + 贪心（推荐）\n\n核心代码：\n  vector<vector<int>> merge(vector<vector<int>>& intervals) {\n      sort(intervals.begin(), intervals.end());   // 按起点升序排序\n      vector<vector<int>> res;\n      for (auto& interval : intervals) {\n          // 不重叠：res 为空 或 当前起点 > 最后一个合并区间的终点\n          if (res.empty() || interval[0] > res.back()[1]) {\n              res.push_back(interval);\n          } else {\n              // 重叠 → 合并：终点取两者较大值\n              res.back()[1] = max(res.back()[1], interval[1]);\n          }\n      }\n      return res;\n  }\n\n举例：intervals = [[1,3],[2,6],[8,10],[15,18]]\n  排序后：[1,3] → 加入 res\n  [2,6]：2 <= 3 重叠 → res 变为 [1,6]\n  [8,10]：8 > 6 不重叠 → 加入，res = [1,6],[8,10]\n  [15,18]：15 > 10 不重叠 → 加入\n  结果：[[1,6],[8,10],[15,18]]\n\n复杂度：时间 O(n log n)（排序主导），空间 O(n)（结果数组）。\n\n方法二：扫描线（差分数组）\n把每个区间的起点 +1、终点后一位 -1，扫一遍求前缀和，>0 的段即为合并区间。\n适用于值域较小的情况，值域大时不如排序法。',
    keyDifficulties: '1. 必须先排序：只有起点有序，重叠区间才会相邻，才能用「与最后一个比较」的思路\n2. 重叠判断：interval[0] <= res.back()[1]（注意包含边界相等也算重叠）\n3. 合并操作：只更新 res.back()[1] 为 max，不需要动起点（起点已经有序且较小）\n4. 用 res 动态维护合并结果，边遍历边合并，避免二次遍历\n5. 变体：区间插入（57 题）已排序 + 插入一个区间；无重叠区间（435 题）求删几个使不重叠',
    createdAt: '2026-08-01T19:00:00'
  },
  {
    id: 39, number: 62, title: '不同路径', titleEn: 'Unique Paths', difficulty: '中等',
    knowledge: ['动态规划', '滚动数组', 'vector'],
    solution: '核心思路：动态规划。到达某个格子的路径数 = 从上面来的路径数 + 从左边来的路径数，即 dp[i][j] = dp[i-1][j] + dp[i][j-1]。第一行和第一列只有一条路（一直向右/向下），初始化为 1。\n\n方法一：二维 DP（O(mn) 空间）\n\n核心代码：\n  int uniquePaths(int m, int n) {\n      vector<vector<int>> dp(m, vector<int>(n, 1));  // 首行首列都是 1\n      for (int i = 1; i < m; i++) {\n          for (int j = 1; j < n; j++) {\n              dp[i][j] = dp[i-1][j] + dp[i][j-1];    // 上 + 左\n          }\n      }\n      return dp[m-1][n-1];\n  }\n\n推导逻辑：\n- 机器人只能向下/向右，所以到达 (i,j) 只能来自上方 (i-1,j) 或左方 (i,j-1)\n- 首行 dp[0][j] = 1（只能一直向右）\n- 首列 dp[i][0] = 1（只能一直向下）\n\n方法二：一维滚动数组（O(n) 空间）\ndp[j] 复用：dp[j] 之前的值 = dp[i-1][j]（上），dp[j-1] = dp[i][j-1]（左）。\n  vector<int> dp(n, 1);\n  for (int i = 1; i < m; i++) {\n      for (int j = 1; j < n; j++) {\n          dp[j] += dp[j-1];   // dp[j] 累加左侧值\n      }\n  }\n  return dp[n-1];\n\n方法三：组合数学（O(min(m,n)) 时间 O(1) 空间）\n从左上到右下共需走 (m-1)+(n-1) = m+n-2 步，其中选 m-1 步向下。\n答案 = C(m+n-2, m-1)。用 long long 防溢出。\n  long long res = 1;\n  int total = m + n - 2, k = min(m-1, n-1);\n  for (int i = 1; i <= k; i++) {\n      res = res * (total - k + i) / i;\n  }\n  return (int)res;',
    keyDifficulties: '1. 状态转移 dp[i][j] = dp[i-1][j] + dp[i][j-1]：只依赖上方和左方，这是二维 DP 的经典递推\n2. 首行首列初始化必须为 1（只有一条路径），否则结果全错\n3. 空间优化：dp[j] += dp[j-1] 用一维数组滚动，因为当前行的值只依赖「本行左边」和「上一行同列」\n4. 组合数学法要防溢出：用 long long 且边乘边除（res = res * x / i 保证整除）\n5. 变体：不同路径 II（63 题）有障碍物 → 障碍位置 dp=0；最小路径和（64 题）求路径上的最小和',
    createdAt: '2026-08-01T20:00:00'
  },
  {
    id: 40, number: 64, title: '最小路径和', titleEn: 'Minimum Path Sum', difficulty: '中等',
    knowledge: ['动态规划', '滚动数组', 'vector'],
    solution: '核心思路：动态规划。到达格子 (i,j) 的最小路径和 = 该格子的值 + min(从上面来的最小和, 从左边来的最小和)，即 dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])。\n\n方法一：二维 DP（O(mn) 空间）\n\n核心代码：\n  int minPathSum(vector<vector<int>>& grid) {\n      int m = grid.size(), n = grid[0].size();\n      vector<vector<int>> dp(m, vector<int>(n, 0));\n      dp[0][0] = grid[0][0];\n      for (int j = 1; j < n; j++) dp[0][j] = dp[0][j-1] + grid[0][j];  // 首行只能向右\n      for (int i = 1; i < m; i++) dp[i][0] = dp[i-1][0] + grid[i][0];  // 首列只能向下\n      for (int i = 1; i < m; i++) {\n          for (int j = 1; j < n; j++) {\n              dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1]);  // 取上/左较小者\n          }\n      }\n      return dp[m-1][n-1];\n  }\n\n与 62 题（不同路径）的对比：\n- 62 题是「计数」：dp[i][j] = dp[i-1][j] + dp[i][j-1]（求和）\n- 64 题是「求最小」：dp[i][j] = grid[i][j] + min(...)（取 min）\n\n方法二：原地修改（O(1) 额外空间）\n直接在 grid 上累加，省去 dp 数组：\n  for (int i = 0; i < m; i++) {\n      for (int j = 0; j < n; j++) {\n          if (i == 0 && j == 0) continue;\n          if (i == 0) grid[i][j] += grid[i][j-1];        // 首行\n          else if (j == 0) grid[i][j] += grid[i-1][j];   // 首列\n          else grid[i][j] += min(grid[i-1][j], grid[i][j-1]);\n      }\n  }\n  return grid[m-1][n-1];\n\n复杂度：时间 O(mn)，空间 O(1)（原地）或 O(n)（滚动数组）。',
    keyDifficulties: '1. 转移方程取 min 而非求和：本题是「最小路径和」，与 62 题「路径计数」的加号不同\n2. 首行/首列初始化：只能一个方向走，必须单独累加，不能走通用转移\n3. 原地修改节省空间：直接在 grid 上累加，因为每个格子只需访问一次，不会影响后续计算\n4. 边界：m 或 n 为 1 时只有一条路，直接返回总和\n5. 进阶变体：网格中有障碍物（63 题）时，障碍位置 dp 设为 INF/0 处理',
    createdAt: '2026-08-01T21:00:00'
  },
  {
    id: 41, number: 72, title: '编辑距离', titleEn: 'Edit Distance', difficulty: '中等',
    knowledge: ['动态规划', 'vector'],
    solution: '核心思路：二维 DP，经典的双序列 DP。dp[i][j] 表示把 word1 的前 i 个字符转换成 word2 的前 j 个字符所需的最少操作数。\n\n核心代码：\n  int minDistance(string word1, string word2) {\n      int m = word1.size(), n = word2.size();\n      vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));\n      // 初始化边界\n      for (int j = 0; j <= n; j++) dp[0][j] = j;  // 空串 -> word2，需插入 j 次\n      for (int i = 0; i <= m; i++) dp[i][0] = i;  // word1 -> 空串，需删除 i 次\n      for (int i = 1; i <= m; i++) {\n          for (int j = 1; j <= n; j++) {\n              if (word1[i-1] == word2[j-1]) {\n                  dp[i][j] = dp[i-1][j-1];  // 当前字符相同，无需操作\n              } else {\n                  dp[i][j] = 1 + min({dp[i-1][j],     // 删除 word1[i-1]\n                                      dp[i][j-1],     // 插入 word2[j-1]\n                                      dp[i-1][j-1]}); // 替换\n              }\n          }\n      }\n      return dp[m][n];\n  }\n\n三个操作的 DP 语义：\n- 删除：word1 删掉一个字符 → dp[i][j] = dp[i-1][j] + 1\n- 插入：word2 插一个字符（等价于 word1 多匹配一个）→ dp[i][j] = dp[i][j-1] + 1\n- 替换：把 word1[i-1] 改成 word2[j-1] → dp[i][j] = dp[i-1][j-1] + 1\n\n举例：word1="horse", word2="ros"\n  dp 表右下角 dp[5][3] = 3，即最少 3 次操作：\n  horse → rorse（替换 h→r）→ rose（删除 r 中的 h？）→ ros\n\n复杂度：时间 O(mn)，空间 O(mn)。\n\n方法二：一维滚动数组（O(n) 空间）\ndp[j] 复用，注意左上角值要用临时变量保存（因为 dp[i-1][j-1] 会被覆盖）。',
    keyDifficulties: '1. 双序列 DP 套路：dp[i][j] 表示两个序列前 i/j 个字符的状态，是这类题（LCS、编辑距离）的通用框架\n2. dp 数组尺寸是 (m+1)×(n+1)，多出一行一列处理「空串」边界\n3. 字符相同时 dp[i][j] = dp[i-1][j-1]（继承左上角，不增加操作）\n4. 三个操作对应三个来源方向：删除=上、插入=左、替换=左上，取最小 +1\n5. 滚动数组优化时，左上角 dp[i-1][j-1] 会被覆盖，需用 prev 临时变量保存',
    createdAt: '2026-08-01T22:00:00'
  },
  {
    id: 42, number: 75, title: '颜色分类', titleEn: 'Sort Colors', difficulty: '中等',
    knowledge: ['双指针', '排序', 'vector'],
    solution: '核心思路：三指针（荷兰国旗问题，Dutch National Flag）。用三个指针把数组分成三段：left 左侧全是 0、right 右侧全是 2、中间是未处理的 1 和待检查元素。curr 扫描中间区域，根据值交换到对应的边界。\n\n方法一：三指针（荷兰国旗，最优 O(n) 时间 O(1) 空间）\n\n核心代码：\n  void sortColors(vector<int>& nums) {\n      int left = 0, curr = 0, right = nums.size() - 1;\n      while (curr <= right) {\n          if (nums[curr] == 0) {\n              swap(nums[left], nums[curr]);\n              left++; curr++;   // 换来的值只可能是 0 或 1，curr 可安全前进\n          } else if (nums[curr] == 2) {\n              swap(nums[curr], nums[right]);\n              right--;          // 换来的值可能是 2，curr 不动，需重新检查\n          } else {\n              curr++;           // 是 1，直接跳过\n          }\n      }\n  }\n\n为什么 curr 有时不动：\n与 right 交换时，right 位置原本的元素可能是 0、1、2 任意值，\n交换到 curr 后需要重新判断，所以 curr 不前进；\n与 left 交换时，left 位置原本只可能是 0 或 1（2 已经被换到右边了），\n所以 curr 可以安全前进。\n\n复杂度：时间 O(n)，空间 O(1)，只遍历一遍。\n\n方法二：计数排序（两遍）\n第一遍统计 0、1、2 各有多少个，第二遍按数量重写数组。\n时间 O(n)，空间 O(1)，但需要两遍遍历，不如三指针优雅。\n\n方法三：库函数（本题禁止）\nsort(nums.begin(), nums.end()) 一行搞定，但题目明确要求不能使用。',
    keyDifficulties: '1. 三指针划分：left 维护 0 的右边界，right 维护 2 的左边界，curr 扫描未处理区\n2. 交换 2 时 curr 不能前进（换来的可能是 2），交换 0 时 curr 可以前进（left 处不可能是 2）\n3. 循环条件是 curr <= right，curr 越过 right 说明全部处理完\n4. 荷兰国旗问题的本质是「三路快排的 partition」，同样可用于快速排序优化\n5. 若用计数排序，注意是「覆盖写」数组而非逐个 swap',
    createdAt: '2026-08-01T23:00:00'
  },
  {
    id: 43, number: 78, title: '子集', titleEn: 'Subsets', difficulty: '中等',
    knowledge: ['回溯算法', '位运算', 'vector'],
    solution: '核心思路：n 个元素的数组有 2^n 个子集（每个元素选或不选）。三种经典做法。\n\n方法一：回溯（推荐，好理解）\n每个节点都记录当前 path（包括空集），遍历时用 start 避免重复。\n\n核心代码：\n  vector<vector<int>> res;\n  vector<int> path;\n  void backtrack(vector<int>& nums, int start) {\n      res.push_back(path);              // 每个状态都是一个子集（含空集）\n      for (int i = start; i < nums.size(); i++) {\n          path.push_back(nums[i]);      // 选\n          backtrack(nums, i + 1);       // 递归（不回头，i+1）\n          path.pop_back();              // 撤销\n      }\n  }\n  backtrack(nums, 0);\n  return res;\n\n与组合的区别：组合在「path 长度 == k」时记录，子集在「每个节点」都记录。\n\n方法二：迭代（逐步扩展）\n初始只有空集，每来一个元素，把它加到「当前所有子集」的末尾生成新子集。\n  vector<vector<int>> res = {{}};\n  for (int num : nums) {\n      int size = res.size();\n      for (int i = 0; i < size; i++) {\n          vector<int> subset = res[i];\n          subset.push_back(num);\n          res.push_back(subset);\n      }\n  }\n  return res;\n\n方法三：位运算（二进制枚举）\n2^n 个子集对应 2^n 个二进制数，第 i 位为 1 表示包含 nums[i]。\n  int n = nums.size();\n  vector<vector<int>> res;\n  for (int mask = 0; mask < (1 << n); mask++) {   // 枚举所有掩码\n      vector<int> subset;\n      for (int i = 0; i < n; i++) {\n          if (mask & (1 << i)) subset.push_back(nums[i]);  // 第 i 位为 1\n      }\n      res.push_back(subset);\n  }\n  return res;\n\n复杂度：三种方法都是 O(2^n) 个子集，时间 O(n × 2^n)，空间 O(n)（回溯栈/迭代临时）。',
    keyDifficulties: '1. 回溯法关键：在每个节点都记录 path（不只是叶子），才能包含所有长度的子集和空集\n2. start 传 i+1 保证不回头，避免重复子集（[1,2] 和 [2,1] 只保留一个）\n3. 迭代法：res 初始为 {{}}，每次把新元素加到所有现有子集末尾，数量翻倍\n4. 位运算：mask 从 0 到 2^n-1，每位的 0/1 决定元素取否，空集对应 mask=0\n5. 与组合/排列对比：子集每节点记录、组合到长度记录、排列全长度记录但顺序敏感',
    createdAt: '2026-08-02T09:00:00'
  },
  {
    id: 44, number: 79, title: '单词搜索', titleEn: 'Word Search', difficulty: '中等',
    knowledge: ['回溯算法', '深度优先搜索', '矩阵操作', 'vector'],
    solution: '核心思路：回溯（DFS）。遍历每个格子作为起点，若与 word[0] 匹配则开始 DFS：四个方向搜索下一个字符，用「临时标记」防止重复使用同一格子，匹配完整个单词返回 true。\n\n方法一：回溯 + 原地标记（推荐）\n\n核心代码：\n  bool exist(vector<vector<char>>& board, string word) {\n      int m = board.size(), n = board[0].size();\n      for (int i = 0; i < m; i++)\n          for (int j = 0; j < n; j++)\n              if (dfs(board, word, i, j, 0)) return true;\n      return false;\n  }\n\n  bool dfs(vector<vector<char>>& board, string& word, int i, int j, int index) {\n      if (i < 0 || i >= board.size() || j < 0 || j >= board[0].size()\n          || board[i][j] != word[index]) return false;  // 越界或不匹配\n      if (index == word.size() - 1) return true;         // 单词匹配完\n      char temp = board[i][j];\n      board[i][j] = \'#\';   // 标记已访问，防止本路径重复使用\n      bool found = dfs(board, word, i+1, j, index+1)     // 下\n                || dfs(board, word, i-1, j, index+1)     // 上\n                || dfs(board, word, i, j+1, index+1)     // 右\n                || dfs(board, word, i, j-1, index+1);    // 左\n      board[i][j] = temp;   // 回溯：恢复原字符\n      return found;\n  }\n\n为什么用「就地标记」而不是 visited 数组：\n直接把格子改成 \'#\' 表示已用，省去额外数组；回溯时恢复即可。\n注意：标记必须及时恢复，否则会影响其他起点的搜索。\n\n复杂度：时间 O(m × n × 4^L)（L 为单词长度），空间 O(L)（递归深度）。\n\n方法二：visited 二维数组\n用 bool visited[m][n] 记录是否访问过，语义更清晰，但多 O(mn) 空间。',
    keyDifficulties: '1. 回溯三要素：越界检查 + 字符匹配检查 + 标记访问/恢复\n2. 就地表记 board[i][j] = \'#\' 比 visited 数组省空间，但必须递归返回后恢复\n3. 终止条件 index == word.size()-1 表示最后一个字符已匹配，返回 true\n4. 每个格子都可能作为起点，主函数要双重循环遍历所有格子\n5. 剪枝可选：若某字符在 board 中出现次数少于 word 所需，直接返回 false（优化）',
    createdAt: '2026-08-02T10:00:00'
  },
  {
    id: 45, number: 96, title: '不同的二叉搜索树', titleEn: 'Unique Binary Search Trees', difficulty: '中等',
    knowledge: ['动态规划', '二叉树', 'vector'],
    solution: '核心思路：动态规划（卡特兰数）。dp[i] 表示用 i 个节点能构成的二叉搜索树（BST）种数。枚举根节点的值，左子树和右子树分别由更小/更大的节点构成，左右子树种数相乘再累加。\n\n方法一：动态规划（O(n²) 时间 O(n) 空间）\n\n核心代码：\n  int numTrees(int n) {\n      vector<int> dp(n + 1, 0);\n      dp[0] = 1;   // 空树：1 种\n      dp[1] = 1;   // 单节点：1 种\n      for (int i = 2; i <= n; i++) {\n          for (int j = 0; j < i; j++) {\n              // 根固定后，左子树 j 个节点，右子树 i-1-j 个节点\n              dp[i] += dp[j] * dp[i-1-j];\n          }\n      }\n      return dp[n];\n  }\n\n推导逻辑：\n当根节点确定时，比根小的节点全部在左子树，比根大的全部在右子树。\n假设根是第 j+1 小的值（0 <= j < i），则：\n  左子树节点数 = j，右子树节点数 = i-1-j\n  该根的方案数 = dp[j] * dp[i-1-j]（左右独立组合）\n对所有可能的根累加即可。\n\n举例：n=3\n  dp[3] = dp[0]*dp[2] + dp[1]*dp[1] + dp[2]*dp[0]\n        = 1*2 + 1*1 + 2*1 = 5\n\n方法二：卡特兰数公式（O(n)）\ndp 序列 1,1,2,5,14,... 就是卡特兰数，可用递推公式直接算：\n  long long dp = 1;  // dp[1]\n  for (int i = 2; i <= n; i++) {\n      dp = dp * (4*i - 2) / (i + 1);   // 卡特兰递推：C(n) = C(n-1)*(4n-2)/(n+1)\n  }\n  return (int)dp;\n\n复杂度：DP O(n²) 时间 O(n) 空间；卡特兰公式 O(n) 时间 O(1) 空间。',
    keyDifficulties: '1. 核心递推 dp[i] = Σ dp[j] * dp[i-1-j]（j 从 0 到 i-1），本质是卡特兰数的定义式\n2. 关键洞察：BST 的结构只由「节点个数」决定，与具体节点值无关（值只决定左右子树的分界）\n3. 枚举根时，左右子树的节点数是 j 和 i-1-j，两者方案数相乘（独立组合）\n4. dp[0] 必须初始化为 1（空树也是一种），否则递推全错\n5. 结果序列 1,1,2,5,14,42,... 是卡特兰数，可用 O(n) 公式验证/加速',
    createdAt: '2026-08-02T13:00:00'
  },
  {
    id: 46, number: 98, title: '验证二叉搜索树', titleEn: 'Validate Binary Search Tree', difficulty: '中等',
    knowledge: ['二叉树', '深度优先搜索', '递归'],
    solution: '核心思路：BST 要求每个节点的值都在一个「有效区间」内。递归时向下传递区间约束 (lower, upper)：左子树收窄为 (lower, val)，右子树收窄为 (val, upper)。节点值必须满足 lower < val < upper。\n\n方法一：递归 + 区间约束（推荐）\n\n核心代码：\n  bool isValidBST(TreeNode* root) {\n      return helper(root, LONG_MIN, LONG_MAX);\n  }\n  bool helper(TreeNode* node, long lower, long upper) {\n      if (!node) return true;                                  // 空树是 BST\n      if (node->val <= lower || node->val >= upper) return false;  // 超出区间\n      return helper(node->left, lower, node->val)   // 左子树：上限收窄为 val\n          && helper(node->right, node->val, upper); // 右子树：下限收窄为 val\n  }\n\n为什么用 long：\n节点值可能是 INT_MIN / INT_MAX，初始区间用 LONG_MIN/LONG_MAX 才能容纳，\n否则边界值会被误判。\n\n方法二：中序遍历（BST 中序是严格升序）\n  long prev = LONG_MIN;\n  bool isValidBST(TreeNode* root) {\n      if (!root) return true;\n      if (!isValidBST(root->left)) return false;   // 先检查左子树\n      if (root->val <= prev) return false;          // 中序应严格递增\n      prev = root->val;                             // 更新前驱\n      return isValidBST(root->right);               // 再检查右子树\n  }\n\n方法三：迭代中序遍历（显式栈）\n用栈模拟中序，维护 prev 判断严格递增，避免递归栈溢出。\n\n复杂度：三种方法都 O(n) 时间，空间 O(n)（递归栈或显式栈）。',
    keyDifficulties: '1. 最常见的错误：只比较当前节点和左右子节点，而没校验「祖先约束」——左子树所有节点必须 < 根，右子树所有节点必须 > 根\n2. 区间约束法：向下传递 (lower, upper)，左子树收上界、右子树收下界，天然满足所有祖先约束\n3. 严格不等：BST 定义是严格小于/大于，节点值相等（重复）不算合法，用 <= / >= 判断\n4. 用 long 而非 int 存边界：避免 INT_MIN/INT_MAX 作为初始边界时误判\n5. 中序法：BST 的中序遍历严格升序，一旦出现逆序就非法',
    createdAt: '2026-08-02T14:00:00'
  },
  {
    id: 47, number: 102, title: '二叉树的层序遍历', titleEn: 'Binary Tree Level Order Traversal', difficulty: '中等',
    knowledge: ['二叉树', '广度优先搜索', '深度优先搜索', 'vector'],
    solution: '核心思路：BFS 层序遍历。用队列逐层处理，每层开始时先用 sz = q.size() 固定当前层的节点数，内层 for 循环恰好处理一层，保证结果按层分组。\n\n方法一：BFS（队列，推荐）\n\n核心代码：\n  vector<vector<int>> levelOrder(TreeNode* root) {\n      vector<vector<int>> res;\n      if (!root) return res;\n      queue<TreeNode*> q;\n      q.push(root);\n      while (!q.empty()) {\n          int sz = q.size();       // 当前层节点数（关键！先固定）\n          vector<int> level;\n          for (int i = 0; i < sz; i++) {\n              TreeNode* node = q.front(); q.pop();\n              level.push_back(node->val);\n              if (node->left)  q.push(node->left);\n              if (node->right) q.push(node->right);\n          }\n          res.push_back(level);    // 一层处理完，加入结果\n      }\n      return res;\n  }\n\n关键细节：\n必须先 int sz = q.size() 固定当前层大小，再在 for 里取节点。\n因为 for 循环中会往队列 push 下一层的节点，如果直接用 q.size() 作为循环条件，\n会把下一层的节点也混进当前层。\n\n复杂度：时间 O(n)，空间 O(n)。\n\n方法二：DFS（递归 + 深度）\n递归时带上 depth，把节点值加到 res[depth] 对应的一层。\n  void dfs(TreeNode* node, int depth) {\n      if (!node) return;\n      if (depth == res.size()) res.push_back({});   // 第一次到达这一层\n      res[depth].push_back(node->val);\n      dfs(node->left, depth + 1);\n      dfs(node->right, depth + 1);\n  }\n\n方法三：锯齿形层序遍历（103 题变体）\n偶数层反转，只需在 BFS 基础上根据层号决定是否 reverse。',
    keyDifficulties: '1. 核心技巧：每层固定 sz = q.size()，内层 for 处理一层，这是层序 BFS 的标准模板\n2. 不能直接用 q.size() 做循环条件：for 中会 push 下一层节点，导致层混在一起\n3. DFS 法：res.size() 恰好等于「已访问的最大深度+1」，depth == res.size() 时创建新层\n4. 空树边界：返回空 vector，不做特殊处理会崩溃\n5. 变体：103 锯齿形（按层交替正反）、107 自底向上层序（结果反转）、199 右视图（每层最后一个）',
    createdAt: '2026-08-02T15:00:00'
  },
  {
    id: 48, number: 105, title: '从前序与中序遍历序列构造二叉树', titleEn: 'Construct Binary Tree from Preorder and Inorder Traversal', difficulty: '中等',
    knowledge: ['二叉树', '递归', 'unordered_map', '深度优先搜索'],
    solution: '核心思路：递归分治。前序遍历的第一个元素是根节点；在中序遍历中找到根的位置，左边是左子树、右边是右子树。递归地对左右子区间重建即可。用哈希表存中序值的下标，O(1) 定位根。\n\n方法一：递归 + 哈希表（推荐，O(n)）\n\n核心代码：\n  TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {\n      unordered_map<int, int> indexMap;\n      for (int i = 0; i < inorder.size(); i++)\n          indexMap[inorder[i]] = i;         // 值 → 中序下标\n      int preIndex = 0;                     // 前序扫描指针\n      return build(preorder, indexMap, preIndex, 0, inorder.size() - 1);\n  }\n  TreeNode* build(vector<int>& preorder, unordered_map<int,int>& indexMap,\n                  int& preIndex, int inLeft, int inRight) {\n      if (inLeft > inRight) return nullptr;   // 空区间\n      int rootVal = preorder[preIndex++];     // 前序第一个是根\n      TreeNode* root = new TreeNode(rootVal);\n      int rootIdx = indexMap[rootVal];        // 根在中序中的位置\n      root->left  = build(preorder, indexMap, preIndex, inLeft, rootIdx - 1);\n      root->right = build(preorder, indexMap, preIndex, rootIdx + 1, inRight);\n      return root;\n  }\n\n推导逻辑：\n- 前序：根 → 左 → 右，所以 preorder[preIndex] 总是当前子树的根\n- 中序：左 → 根 → 右，所以根把中序区间分成左子树区间和右子树区间\n- preIndex 用引用传递：左子树消耗了几个前序元素，右子树自然接在后面\n\n举例：\npreorder = [3,9,20,15,7], inorder = [9,3,15,20,7]\n  根 = 3，中序中 3 的下标 1 → 左子树区间 [0,0]=[9]，右子树区间 [2,4]=[15,20,7]\n  递归重建左右子树。\n\n复杂度：时间 O(n)（每个节点一次），空间 O(n)（哈希表 + 递归栈）。',
    keyDifficulties: '1. 核心洞察：前序确定「根」，中序确定「左右子树划分」，两者配合才能唯一重建二叉树\n2. preIndex 必须用引用（&）传递，因为左子树递归会消耗前序元素，右子树要接着用\n3. 哈希表存中序值→下标，避免每次 O(n) 扫描找根\n4. 边界：inLeft > inRight 表示空子树，返回 nullptr（递归终止）\n5. 变体：中序+后序（106 题）——后序最后一个元素是根，其余同理；没有中序无法唯一确定树',
    createdAt: '2026-08-02T16:00:00'
  },
  {
    id: 49, number: 114, title: '二叉树展开为链表', titleEn: 'Flatten Binary Tree to Linked List', difficulty: '中等',
    knowledge: ['二叉树', '深度优先搜索', '递归'],
    solution: '核心思路：原地展开为先序顺序的链表，left 全置 null，用 right 串起来。两种做法。\n\n方法一：原地连接（推荐，O(n) 时间 O(1) 空间）\n\n核心代码：\n  void flatten(TreeNode* root) {\n      TreeNode* curr = root;\n      while (curr) {\n          if (curr->left) {\n              // 找左子树的最右节点（先序中当前节点的下一个应到它）\n              TreeNode* pred = curr->left;\n              while (pred->right) pred = pred->right;\n              // 把当前节点的右子树接到左子树最右节点的右边\n              pred->right = curr->right;\n              // 左子树移到右边，左指针置空\n              curr->right = curr->left;\n              curr->left = nullptr;\n          }\n          curr = curr->right;   // 继续下一个节点\n      }\n  }\n\n思路拆解：\n对每个有左子树的节点 curr：\n- 左子树的「最右节点」（pred）在展开后应该接在 curr 之后、原右子树之前\n- 所以先把原右子树接到 pred->right\n- 再把左子树整体移到 curr->right，左指针清空\n- 这样 curr 的左子树就平铺到了当前节点后面，且不丢失原右子树\n\n方法二：前序遍历 + 重建（O(n) 空间）\n先序收集所有节点到数组，再逐个改指针：每个节点 left=null，right=下一个节点。\n逻辑最简单，但需要 O(n) 额外空间。\n\n方法三：递归（后序处理）\n先展开左右子树，再拼接：左子树尾节点接右子树头，当前节点接左子树头。\n\n复杂度：原地连接法时间 O(n)，空间 O(1)，最优。',
    keyDifficulties: '1. 核心技巧：利用「左子树的最右节点」作为连接点——它在先序中正好是左子树最后一个节点，之后才轮到原右子树\n2. 必须先保存 pred 再改指针：先 pred->right = curr->right，再 curr->right = curr->left\n3. 修改后要把 curr->left 置空，否则 left 指针还在，不满足展开定义\n4. 原地法不需要额外数组，是面试官想要的答案；前序重建法最直观但 O(n) 空间\n5. 展开顺序是「先序」：根 → 左子树（平铺）→ 右子树，注意拼接顺序别颠倒',
    createdAt: '2026-08-02T17:00:00'
  },
  {
    id: 50, number: 236, title: '二叉树的最近公共祖先', titleEn: 'Lowest Common Ancestor of a Binary Tree', difficulty: '中等',
    knowledge: ['二叉树', '递归', '深度优先搜索'],
    solution: '方法一：递归（后序遍历，推荐）\n从根往下找 p 和 q：\n1. 递归终止：root 为空或 root == p 或 root == q，直接返回 root\n2. 递归左子树得 left，右子树得 right\n3. left 和 right 都非空 → p、q 分居两侧，root 就是最近公共祖先\n4. 只有一边非空 → p、q 都在这一侧，返回非空的那一边（答案在子树里继续上抛）\n\n本质：递归函数的含义是「在以 root 为根的树中找 p 和 q 的 LCA，若只遇到其中一个则返回那一个」。\n\n核心代码：\n  TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {\n      if (!root || root == p || root == q) return root;  // 到底或遇到目标\n      TreeNode* left  = lowestCommonAncestor(root->left, p, q);\n      TreeNode* right = lowestCommonAncestor(root->right, p, q);\n      if (left && right) return root;      // p、q 分居两侧，当前节点即 LCA\n      return left ? left : right;          // 把找到的一边向上传\n  }\n\n方法二：哈希表存父指针\n用 DFS 建立每个节点→父节点的映射，再从 p 往上把所有祖先加入集合，最后从 q 往上走，第一个出现在集合里的节点就是 LCA。写法直观但要 O(n) 空间。\n\n时间复杂度 O(n)，空间复杂度 O(n)（递归栈）。',
    keyDifficulties: '1. 理解递归返回值的「三态」：返回 LCA / 只遇到 p / 只遇到 q，靠返回值把信息上抛\n2. p、q 分居两侧时当前节点才是答案；同侧时答案在子树中，必须把非空结果继续返回\n3. 题目保证 p、q 都存在，所以不需要额外判「只找到一个」的失败情况\n4. 该解法对普通二叉树适用；若是 BST 可用大小比较直接走左/右（更快的 O(h) 版本）',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 51, number: 739, title: '每日温度', titleEn: 'Daily Temperatures', difficulty: '中等',
    knowledge: ['单调栈', 'stack'],
    solution: '方法一：单调栈（推荐）\n维护一个「下标单调递减」的栈（对应温度递减）：\n1. 遍历每个温度 t[i]：当栈非空且 t[i] > t[栈顶] 时，说明当前天就是栈顶那天的「下一个更暖日」\n2. 弹出栈顶 j，res[j] = i - j\n3. 重复第 2 步直到栈顶温度 >= 当前温度（或栈空），再把 i 入栈\n4. 遍历结束后仍在栈里的下标，右边没有更暖的一天，res 保持 0\n\n栈里存下标而不是温度：因为答案要算「距离」，温度可以从数组反查。\n\n核心代码：\n  vector<int> dailyTemperatures(vector<int>& temperatures) {\n      int n = temperatures.size();\n      vector<int> ans(n, 0);\n      stack<int> st;                       // 存下标，对应温度单调递减\n      for (int i = 0; i < n; i++) {\n          while (!st.empty() && temperatures[i] > temperatures[st.top()]) {\n              int prev = st.top(); st.pop();\n              ans[prev] = i - prev;        // i 是 prev 之后第一个更暖的天\n          }\n          st.push(i);\n      }\n      return ans;                          // 栈中剩下的下标答案保持 0\n  }\n\n方法二：倒序跳表\n从右往左，j = i+1，若 t[j] <= t[i] 就跳 j += res[j]（利用已算好的结果直接跳到 j 的下一个更暖日），均摊 O(n)。\n\n时间复杂度 O(n)（每个下标至多入栈/出栈一次），空间复杂度 O(n)。',
    keyDifficulties: '1. 栈内保持「温度递减」，遇到更大温度时循环弹栈结算\n2. 存下标而非温度值——res 需要下标差；温度用 t[st.top()] 反查\n3. 弹栈结算发生在「当前元素大于栈顶」时，当前元素就是栈顶的答案\n4. 遍历结束后栈中残留的下标右侧无更大值，答案为 0（初始化即 0，不用额外处理',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 52, number: 221, title: '最大正方形', titleEn: 'Maximal Square', difficulty: '中等',
    knowledge: ['动态规划', '矩阵操作'],
    solution: '方法一：动态规划（推荐）\ndp[i][j] 表示「以 (i,j) 为右下角的全 1 正方形最大边长」：\n1. matrix[i][j] == \'0\' 时 dp[i][j] = 0\n2. 否则 dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1\n   （左、上、左上三个方向的正方形都至少是 k-1，自己才能撑到 k）\n3. 过程中用 dp[i][j] 的最大值更新答案 ans，返回 ans*ans\n\n为什么取 min：以 (i,j) 为右下角、边长 k 的正方形，等价于左侧、上侧、左上侧各嵌着一个边长 k-1 的正方形，三者取短板。\n\n核心代码：\n  int maximalSquare(vector<vector<char>>& matrix) {\n      int m = matrix.size(), n = matrix[0].size(), side = 0;\n      vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));\n      for (int i = 1; i <= m; i++)\n          for (int j = 1; j <= n; j++)\n              if (matrix[i-1][j-1] == \'1\') {\n                  dp[i][j] = min({dp[i-1][j], dp[i][j-1], dp[i-1][j-1]}) + 1;\n                  side = max(side, dp[i][j]);  // dp[i][j]：以 (i,j) 为右下角的最大边长\n              }\n      return side * side;\n  }\n\n方法二：暴力 + 前缀和\n枚举每个右下角和边长，用二维前缀和 O(1) 判断区域内是否全 1，总 O(n·m·min(n,m))，能过但慢。\n\n时间复杂度 O(nm)，空间复杂度 O(nm)（可滚动数组优化到 O(m)）。',
    keyDifficulties: '1. dp 定义是「以该点为右下角」，不是「区域内最大正方形」——定义错整题就错\n2. 转移是三个方向取 min 再 +1，容易漏掉左上角 dp[i-1][j-1]\n3. 第一行、第一列要单独初始化（matrix 为字符 \'1\'/\'0\'，记得转 int）\n4. 答案是边长的平方，别直接返回 dp 最大值',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 53, number: 215, title: '数组中的第K个最大元素', titleEn: 'Kth Largest Element in an Array', difficulty: '中等',
    knowledge: ['堆', '快速选择', '分治'],
    solution: '方法一：小顶堆（推荐，稳定 O(n log k)）\n维护一个大小为 k 的小顶堆：\n1. 前 k 个元素直接入堆\n2. 之后每个元素 x：若 x > 堆顶则弹出堆顶、x 入堆；否则跳过\n3. 遍历结束堆顶就是第 k 大\n\nC++ 用 priority_queue<int, vector<int>, greater<int>> 实现小顶堆。\n\n核心代码：\n  int findKthLargest(vector<int>& nums, int k) {\n      int target = nums.size() - k;        // 第 k 大 = 升序下标 n-k\n      int l = 0, r = nums.size() - 1;\n      while (true) {\n          int pivot = nums[r], i = l;      // Lomuto 划分\n          for (int j = l; j < r; j++)\n              if (nums[j] < pivot) swap(nums[i++], nums[j]);\n          swap(nums[i], nums[r]);\n          if (i == target) return nums[i];\n          else if (i < target) l = i + 1;  // 只在目标所在半边继续\n          else r = i - 1;\n      }\n  }\n\n方法二：快速选择（期望 O(n)）\n随机选 pivot 做 partition，使「 pivot 左边都大、右边都小」的降序划分：\n- 若 pivot 下标 == k-1，直接返回\n- 若 pivot 下标 > k-1，只在左半继续找；否则在右半找\n每轮只递归一侧，期望复杂度 O(n)。最坏 O(n²)，随机化 pivot 可规避。\n\n方法三：计数排序（值域固定时）\n当元素范围很小（如 -10^4~10^4）可直接开桶统计，O(n + C)。\n\n时间复杂度：堆 O(n log k)，快选期望 O(n)；空间 O(k) / O(1)。',
    keyDifficulties: '1. 「第 k 大」是降序第 k 个，转成「升序第 n-k+1 小」再选 pivot 位置，别搞反方向\n2. 快速选择每轮只递归包含目标位置的那一侧，这是与快排的本质区别（快排两侧都要递归）\n3. 堆解法保持堆大小不超过 k：新元素大于堆顶才替换，否则丢弃\n4. 面试要求 O(n) 时用快速选择；数据流场景（数据不断到来）只能用堆',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 54, number: 208, title: '实现 Trie (前缀树)', titleEn: 'Implement Trie (Prefix Tree)', difficulty: '中等',
    knowledge: ['前缀树', '哈希表'],
    solution: '方法一：数组孩子节点（推荐）\n每个节点持有 children[26] 和 isEnd 标志：\n1. insert(word)：从根出发，逐字符 c 计算 idx = c-\'a\'，若 children[idx] 为空就 new 一个新节点；走到末尾把最后节点 isEnd = true\n2. search(word)：逐字符往下走，任一孩子为空返回 false；走完后必须 isEnd == true（完整单词而非前缀）\n3. startsWith(prefix)：与 search 相同但不检查 isEnd，走到底即返回 true\n\n核心代码：\n  class Trie {\n      struct Node { Node* child[26] = {}; bool isEnd = false; };\n      Node* root = new Node();\n      Node* find(string& s) {\n          Node* cur = root;\n          for (char c : s) {\n              cur = cur->child[c - \'a\'];\n              if (!cur) return nullptr;\n          }\n          return cur;\n      }\n  public:\n      void insert(string word) {\n          Node* cur = root;\n          for (char c : word) {\n              int i = c - \'a\';\n              if (!cur->child[i]) cur->child[i] = new Node();  // 缺路就建\n              cur = cur->child[i];\n          }\n          cur->isEnd = true;               // 标记完整单词结尾\n      }\n      bool search(string word) {\n          Node* cur = find(word);\n          return cur && cur->isEnd;        // 必须走到单词结尾标记\n      }\n      bool startsWith(string prefix) {\n          return find(prefix) != nullptr;  // 前缀只需路径存在\n      }\n  };\n\n方法二：unordered_map 孩子\nchildren 用 unordered_map<char, Node*> 代替数组，节省稀疏空间但常数略大、查询稍慢。\n\n方法三（优化）：删除无意义，可在节点上存 pass 计数支持统计，本题不需要。\n\n时间复杂度：三操作均 O(L)（L 为单词/前缀长度）；空间 O(总字符数 × 26)。',
    keyDifficulties: '1. search 与 startsWith 的唯一区别：前者要求结尾节点 isEnd==true，后者只要求路径存在\n2. 单词结尾必须打 isEnd 标记——插入 "app" 后再查 "apple"，路径能走通但那是前缀不是单词\n3. 根节点不存任何字符，第一个字符从 root->children[c-\'a\'] 开始\n4. 多次 insert 同一单词是幂等的（isEnd 重复置 true 无副作用）',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 55, number: 207, title: '课程表', titleEn: 'Course Schedule', difficulty: '中等',
    knowledge: ['拓扑排序', '广度优先搜索', '深度优先搜索'],
    solution: '问题本质：判断有向图是否存在拓扑序（等价于是否存在环）。\n\n方法一：Kahn 算法（BFS 拓扑排序，推荐）\n1. 建邻接表 graph[a] = {b}（a 是 b 的先修），统计每个点的入度 inDegree[b]\n2. 所有入度为 0 的课程入队（没有先修，可直接学）\n3. 每出队一个课程，计数 +1；其邻接点入度 -1，减到 0 就入队\n4. 最终若出队计数 == 课程总数 numCourses，说明可以修完（无环）；否则有环\n\n核心代码：\n  bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {\n      vector<vector<int>> g(numCourses);\n      vector<int> indeg(numCourses, 0);\n      for (auto& e : prerequisites) { g[e[1]].push_back(e[0]); indeg[e[0]]++; }\n      queue<int> q;\n      for (int i = 0; i < numCourses; i++)\n          if (indeg[i] == 0) q.push(i);    // 所有入度 0 的起点入队\n      int done = 0;\n      while (!q.empty()) {\n          int c = q.front(); q.pop(); done++;\n          for (int nx : g[c]) if (--indeg[nx] == 0) q.push(nx);\n      }\n      return done == numCourses;           // 有环则必有节点入度无法清零\n  }\n\n方法二：DFS 三色标记判环\n每个节点三种状态：0 未访问、1 访问中（在当前 DFS 栈里）、2 已完成。\nDFS 中遇到状态 1 的点 → 出现回边 → 有环。所有点都安全走完则无环。\n\n时间复杂度 O(V+E)，空间复杂度 O(V+E)。',
    keyDifficulties: '1. 建边方向：先修 b 才能修 a → 边 b→a，inDegree[a]++；方向建反了拓扑序就错了\n2. Kahn 判环的依据是「最终出队数量 < 节点总数」——环上的点入度永远减不到 0\n3. DFS 判环的核心是三色标记，「访问中」遇到自己路径上的点才是环，遇到「已完成」的点不是环\n4. 队列初始要把所有入度 0 的点一次全放入，不是只放一个',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 56, number: 200, title: '岛屿数量', titleEn: 'Number of Islands', difficulty: '中等',
    knowledge: ['深度优先搜索', '广度优先搜索', '矩阵操作'],
    solution: '思路：把每个 \'1\' 视为陆地格子。遍历整个网格，每遇到一个没被访问过的 \'1\'，岛屿计数 +1，然后用一次 DFS/BFS 把这块岛屿「淹没」（把连通的所有 \'1\' 改成 \'0\' 或打上访问标记），保证同一座岛不会被数两次。\n\n方法一：DFS（推荐，最短）\ngrid[i][j] == \'1\' 时：计数 +1，dfs(i,j) 把自身和上下左右四个方向的 \'1\' 全部置 \'0\'。递归边界：越界或非 \'1\' 直接返回。\n\n核心代码：\n  int numIslands(vector<vector<char>>& grid) {\n      int m = grid.size(), n = grid[0].size(), cnt = 0;\n      for (int i = 0; i < m; i++)\n          for (int j = 0; j < n; j++)\n              if (grid[i][j] == \'1\') { cnt++; dfs(grid, i, j); }  // 发现新岛\n      return cnt;\n  }\n  void dfs(vector<vector<char>>& g, int i, int j) {\n      if (i < 0 || j < 0 || i >= g.size() || j >= g[0].size() || g[i][j] != \'1\') return;\n      g[i][j] = \'0\';                       // 就地沉没，免 visited 数组\n      dfs(g, i+1, j); dfs(g, i-1, j); dfs(g, i, j+1); dfs(g, i, j-1);\n  }\n\n方法二：BFS\n遇到 \'1\' 计数 +1 后入队，队列循环中取格子、置 \'0\'、四方向邻居为 \'1\' 的入队。注意入队时立刻标记，否则同一格会被重复入队导致超时。\n\n方法三：并查集\n把所有 \'1\' 格子与右/下方向的 \'1\' 格子合并，最终不同根的个数即岛屿数。\n\n时间复杂度 O(nm)（每个格子至多访问常数次），空间 O(nm)（递归栈/队列）。',
    keyDifficulties: '1. 「淹没」置 \'0\' 要在访问时立刻做（DFS 递归入口 / BFS 入队时），否则同一格子被反复访问\n2. 四方向只需「上下左右」，不要斜方向——岛屿定义是四连通\n3. DFS 递归在极限数据（全 \'1\' 的 300×300 网格）可能爆栈，BFS 更稳\n4. 若题目不允许修改原网格，用 visited 数组代替置 \'0\'，逻辑完全相同',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 57, number: 198, title: '打家劫舍', titleEn: 'House Robber', difficulty: '中等',
    knowledge: ['动态规划', '滚动数组'],
    solution: '核心约束：不能偷相邻两家。\n\n方法一：动态规划（推荐）\ndp[i] 表示考虑前 i+1 家能偷到的最大金额：\ndp[i] = max(dp[i-1], dp[i-2] + nums[i])\n—— 第 i 家要么不偷（沿用 dp[i-1]），要么偷（前一家必须不偷，dp[i-2] + nums[i]）。\n\n核心代码：\n  int rob(vector<int>& nums) {\n      int prev2 = 0, prev1 = 0;            // dp[i-2], dp[i-1]\n      for (int x : nums) {\n          int cur = max(prev1, prev2 + x); // 不偷 x / 偷 x（隔一家）\n          prev2 = prev1; prev1 = cur;\n      }\n      return prev1;\n  }\n\n方法二：滚动变量优化\n只需要前两个状态，用 prev/cur 两个变量滚动：\ncur, prev = max(prev + nums[i], cur), cur\n\n初始：prev = 0, cur = nums[0]。\n\n时间复杂度 O(n)，空间复杂度 O(1)。',
    keyDifficulties: '1. 转移方程两项分别对应「不偷第 i 家」和「偷第 i 家」，偷 i 时跳的是 i-1 不是 i+1\n2. 滚动变量更新顺序：先算新的 cur 再让 prev 接旧 cur，一条元组/临时变量语句可避免覆盖\n3. dp[i-2] 这一维不能省略——「偷或不偷」必须区分一格间隔\n4. 后续题（213 环形、337 树形）都在此转移上加约束，本题是打家劫舍系列的模板',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 58, number: 238, title: '除了自身以外数组的乘积', titleEn: 'Product of Array Except Self', difficulty: '中等',
    knowledge: ['前缀和', 'vector'],
    solution: '关键限制：不能用除法，且要求 O(n)。\n\n方法一：前缀积 × 后缀积（推荐）\nres[i] = (i 左边所有数的乘积) × (i 右边所有数的乘积)：\n1. 第一遍从左到右：res[i] = res[i-1] * nums[i-1]，res[0] = 1（res[i] 暂存左侧前缀积）\n2. 第二遍从右到左：用变量 suffix 从 1 开始，res[i] *= suffix; suffix *= nums[i]\n\n两次遍历后 res[i] 恰好是「左积 × 右积」，不含自身。\n\n核心代码：\n  vector<int> productExceptSelf(vector<int>& nums) {\n      int n = nums.size();\n      vector<int> ans(n, 1);\n      for (int i = 1; i < n; i++) ans[i] = ans[i-1] * nums[i-1];  // 左积\n      int right = 1;\n      for (int i = n - 1; i >= 0; i--) {   // 右积用变量滚动\n          ans[i] *= right;\n          right *= nums[i];\n      }\n      return ans;\n  }\n\n方法二：分开两个数组\n先建 L[i]（左侧积）与 R[i]（右侧积）两个数组再相乘，逻辑更直观但多用 O(n) 空间（输出数组不计入空间时方法一更优）。\n\n时间复杂度 O(n)，空间复杂度 O(1)（除输出数组外）。',
    keyDifficulties: '1. 禁用除法的根源：nums 里有 0 时除法会失效（且题目明确禁止）\n2. 复用输出数组存「左侧前缀积」，第二遍倒序乘「右侧后缀积」，是空间 O(1) 的关键\n3. suffix 变量初始为 1，且要先乘进 res 再乘 nums[i]，顺序写反会把自身也算进去\n4. res[0] 与 res[n-1] 的另一侧乘积是 1（空积），不要遗漏初始化',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 59, number: 155, title: '最小栈', titleEn: 'Min Stack', difficulty: '中等',
    knowledge: ['stack', '设计'],
    solution: '方法一：辅助栈（推荐）\n主栈 st 存所有元素，辅助栈 minSt 同步存「当前栈内的最小值」：\n1. push(x)：st 入 x；minSt 为空或 x <= minSt.top() 时 minSt 也入 x（注意用 <=）\n2. pop()：st 出栈；若出栈值 == minSt.top()，minSt 也出栈\n3. top()：st.top()；getMin()：minSt.top()\n\n用 <= 的原因：相同的最小值要重复入栈，否则弹出一份后另一份查不到最小值。\n\n核心代码：\n  class MinStack {\n      stack<int> st, mn;                   // mn 栈顶始终是当前最小值\n  public:\n      void push(int val) {\n          st.push(val);\n          mn.push(mn.empty() ? val : min(val, mn.top()));  // 两栈同步压入\n      }\n      void pop()   { st.pop(); mn.pop(); } // 同步弹出\n      int top()    { return st.top(); }\n      int getMin() { return mn.top(); }    // O(1) 取最小\n  };\n\n方法二：差值法（O(1) 空间）\n只存一个栈和一个 min 变量，栈里存 x - min（long 防溢出）：\n- 差值 < 0 说明入栈的是新最小值\n- 弹栈时差值 < 0 说明弹出的是最小值，需要用 min - 差值 还原上一个最小值\n\n方法三（C++ 取巧）：std::stack<pair<int,int>> 每层同时存「值 + 当前最小值」，逻辑等价于方法一。\n\n各操作均 O(1)，方法一空间最坏 O(n)。',
    keyDifficulties: '1. 辅助栈入栈条件是 x <= min（不是 <）：重复最小值必须重复入栈，否则弹出一份后 getMin 出错\n2. pop 时要「先比较再弹」：出栈值等于 minSt 栈顶时 minSt 才同步弹出\n3. 差值法栈内可能存负数，用 long long 防止 x - min 溢出 int\n4. getMin 在栈空时行为未定义，接口按题意保证在非空时调用',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 60, number: 152, title: '乘积最大子数组', titleEn: 'Maximum Product Subarray', difficulty: '中等',
    knowledge: ['动态规划', '贪心算法'],
    solution: '与 53 题最大子数组和的最大区别：负数乘负数会翻正，所以「当前最小」可能一下变成「全局最大」。\n\n方法一：同时维护最大/最小（推荐）\n遍历数组，维护以 i 结尾的：\nmaxF[i] = max(nums[i], maxF[i-1]*nums[i], minF[i-1]*nums[i])\nminF[i] = min(nums[i], maxF[i-1]*nums[i], minF[i-1]*nums[i])\n答案取所有 maxF[i] 的最大值。\n\n三个候选取 max/min 的原因：nums[i] 本身（重新开段子数组）、接在前面最大后面、接在前面最小后面（负负得正）。\n\n核心代码：\n  int maxProduct(vector<int>& nums) {\n      int mx = nums[0], mn = nums[0], ans = nums[0];\n      for (int i = 1; i < nums.size(); i++) {\n          if (nums[i] < 0) swap(mx, mn);   // 负数让最大变最小\n          mx = max(nums[i], mx * nums[i]); // 以 i 结尾的最大积\n          mn = min(nums[i], mn * nums[i]); // 以 i 结尾的最小积\n          ans = max(ans, mx);\n      }\n      return ans;\n  }\n\n方法二：遇负交换\n若 nums[i] < 0，先交换 maxF 与 minF 再做普通转移，效果等价、代码更短。\n\n时间复杂度 O(n)，空间复杂度 O(1)（滚动变量即可）。',
    keyDifficulties: '1. 不能照搬 53 题只维护最大值——负数会让历史最小翻正成最大\n2. maxF/minF 必须基于「上一轮」的值同时更新，先把旧 maxF 存临时变量防覆盖污染\n3. 转移候选里必须包含 nums[i] 单独成段（前面积累可能是负担）\n4. 答案要全程取 max（0 也可能是答案，如 [-2]），初始值设为 nums[0] 而非 0',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 61, number: 148, title: '排序链表', titleEn: 'Sort List', difficulty: '中等',
    knowledge: ['链表', '分治', '归并排序', '快慢指针'],
    solution: '要求 O(n log n) 时间且常数级空间尽量优化——链表版归并排序。\n\n方法一：归并排序（递归版，推荐）\n1. 快慢指针找中点：slow 每次 1 步、fast 每次 2 步，注意要把中点前一个节点断开（slow 停在前半最后一个或用 prev 记录）\n2. 对左右两半递归排序\n3. 合并两个有序链表（21 题的逻辑：哑节点 + 双指针取小接到尾部）\n\n核心代码：\n  ListNode* sortList(ListNode* head) {\n      if (!head || !head->next) return head;\n      ListNode *slow = head, *fast = head->next;      // 快慢指针找中点\n      while (fast && fast->next) { slow = slow->next; fast = fast->next->next; }\n      ListNode* mid = slow->next; slow->next = nullptr;  // 断成两半\n      return merge(sortList(head), sortList(mid));       // 递归排序后合并\n  }\n  ListNode* merge(ListNode* a, ListNode* b) {\n      ListNode dummy, *t = &dummy;\n      while (a && b) {\n          if (a->val < b->val) { t->next = a; a = a->next; }\n          else                 { t->next = b; b = b->next; }\n          t = t->next;\n      }\n      t->next = a ? a : b;\n      return dummy.next;\n  }\n\n方法二：自底向上迭代归并\n先两两合并长度 1 的段，再合并长度 2、4、8……直到段长 >= n。\n用迭代代替递归，空间 O(1)（无递归栈）。代码较长，面试能说清思路即可。\n\n方法三（不推荐）：把值拷进数组排序再写回，时间能过但违背链表原位排序的考察意图。\n\n时间复杂度 O(n log n)，空间复杂度：递归版 O(log n)（栈），迭代版 O(1)。',
    keyDifficulties: '1. 找中点必须把链表「切断」：不断开会导致递归死循环（前半的尾还指着后半的头）\n2. 快慢指针停的位置决定两半长度（偶数长度时 slow 停在中间偏左或偏右要对齐断点写法）\n3. 合并阶段用哑节点统一头节点处理，返回 dummy->next\n4. 迭代版外层是「段长翻倍」、内层是「逐段归并」，边界（剩余不足两个整段）最容易写错',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 62, number: 146, title: 'LRU 缓存', titleEn: 'LRU Cache', difficulty: '中等',
    knowledge: ['哈希表', '设计', '链表'],
    solution: 'LRU = Least Recently Used：容量满时淘汰「最久未使用」的条目。需要 get/put 都 O(1)。\n\n方法一：哈希表 + 双向链表（推荐）\n- 双向链表按使用时间排序：头部是最近使用，尾部是最久未用\n- 哈希表 unordered_map<int, DListNode*> 实现 key → 节点 O(1) 定位\n- get(key)：命中则把节点移到链表头并返回；未命中返回 -1\n- put(key, value)：已存在则更新值并移到头部；不存在则新建节点插头，若超容量删除链表尾节点并同时删哈希表项\n\n为什么必须双向链表：删除任意节点需要 O(1)，单向链表拿不到前驱。\n\n核心代码：\n  class LRUCache {\n      int cap;\n      list<pair<int,int>> dq;              // front = 最近使用\n      unordered_map<int, list<pair<int,int>>::iterator> mp;\n  public:\n      LRUCache(int capacity) : cap(capacity) {}\n      int get(int key) {\n          auto it = mp.find(key);\n          if (it == mp.end()) return -1;\n          dq.splice(dq.begin(), dq, it->second);   // 提到最前（O(1)）\n          return it->second->second;\n      }\n      void put(int key, int value) {\n          auto it = mp.find(key);\n          if (it != mp.end()) {\n              it->second->second = value;\n              dq.splice(dq.begin(), dq, it->second);\n              return;\n          }\n          if (dq.size() == cap) { mp.erase(dq.back().first); dq.pop_back(); }  // 淘汰最久未用\n          dq.emplace_front(key, value);\n          mp[key] = dq.begin();\n      }\n  };\n\n方法二（C++ 实用解）：list<pair<int,int>> + unordered_map<int, list::iterator>\nsplice 把命中节点移到 begin()，常数小、代码短。\n\n各操作时间复杂度 O(1)，空间 O(capacity)。',
    keyDifficulties: '1. 淘汰时「删链表尾」和「删哈希表项」必须同步做，漏一边会导致 get 到悬空节点\n2. get 命中也要把节点移到头部——「读」也算一次使用\n3. put 更新已存在 key 时不占新容量，只有新插入才可能触发淘汰\n4. 移动/删除节点用哑头哑尾（dummy head/tail）可免掉大量边界判空',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 63, number: 142, title: '环形链表 II', titleEn: 'Linked List Cycle II', difficulty: '中等',
    knowledge: ['快慢指针', '链表'],
    solution: '要求返回入环的第一个节点（141 只需判环）。\n\n方法一：快慢指针（推荐，O(1) 空间）\n1. fast 每次 2 步、slow 每次 1 步，相遇则说明有环（无环 fast 先到 nullptr）\n2. 相遇后：把一个指针放回头节点，两指针都改为每次 1 步，再次相遇的位置就是入环点\n\n推导：设头到入环点距离 a，入环点到相遇点距离 b，相遇点绕回入环点距离 c。\n相遇时 slow 走 a+b，fast 走 a+b+k(b+c)，且 fast 是 slow 的两倍：\na+b+k(b+c) = 2(a+b) → a = c + (k-1)(b+c)\n即从头走 a 步 = 从相遇点走 c（再绕整圈）步，两者恰在入环点会合。\n\n核心代码：\n  ListNode* detectCycle(ListNode* head) {\n      ListNode *slow = head, *fast = head;\n      while (fast && fast->next) {\n          slow = slow->next; fast = fast->next->next;\n          if (slow == fast) {              // 相遇即有环\n              ListNode* p = head;\n              while (p != slow) { p = p->next; slow = slow->next; }  // 同速再遇即入环点\n              return p;\n          }\n      }\n      return nullptr;\n  }\n\n方法二：哈希表\n遍历存 visited 节点指针，第一个重复出现的指针即入环点。O(n) 空间但零推导。\n\n时间复杂度 O(n)，空间复杂度 O(1)。',
    keyDifficulties: '1. 「相遇后一指针回头、同速再走」这一步必须记得，纯背模板容易漏\n2. fast 走两步的循环条件要写 while (fast && fast->next)，空指针解引用是高频 RE\n3. 推导结论 a = c (mod 环长) 是面试高频追问，建议能现场推\n4. 环可能出现在头节点（a=0），推导同样成立，无需特判',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 64, number: 139, title: '单词拆分', titleEn: 'Word Break', difficulty: '中等',
    knowledge: ['动态规划', '哈希表'],
    solution: '判断 s 能否被字典中的单词拼接（单词可重复使用）。\n\n方法一：动态规划（推荐）\ndp[i] 表示 s[0..i-1] 能否被拆分：\ndp[i] = OR over j in [0, i)：dp[j] && s.substr(j, i-j) 在字典中\n- dp[0] = true（空串可拆分）\n- 用 unordered_set 存字典实现 O(1) 查询\n- 枚举 j 时可加剪枝：i-j 超过字典最长单词长度就 break\n\n核心代码：\n  bool wordBreak(string s, vector<string>& wordDict) {\n      unordered_set<string> dict(wordDict.begin(), wordDict.end());\n      int n = s.size();\n      vector<bool> dp(n + 1, false);\n      dp[0] = true;                        // 空前缀合法\n      for (int i = 1; i <= n; i++)\n          for (int j = 0; j < i; j++)\n              if (dp[j] && dict.count(s.substr(j, i - j))) { dp[i] = true; break; }\n      return dp[n];\n  }\n\n方法二：记忆化搜索\ndfs(i) 表示从下标 i 开始的后缀能否拆分；用 memo 数组避免重复子问题。与方法一本质相同、方向相反。\n\n时间复杂度 O(n²)（substr 比较再乘 L，可用字典哈希优化），空间 O(n)。',
    keyDifficulties: '1. dp[i] 的定义是「前 i 个字符」即 s[0..i-1]，下标含义错会导致边界全错\n2. dp[0] = true 是空串基例，没有它所有转移都推不动\n3. 枚举分割点 j 时，[j, i) 这一段必须整个出现在字典里，不能部分匹配\n4. 完全背包视角：单词是「物品」（可重复用），s 的每个前缀是「容量」，这也是把它归为完全背包题的原因',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 65, number: 647, title: '回文子串', titleEn: 'Palindromic Substrings', difficulty: '中等',
    knowledge: ['中心扩展法', '动态规划'],
    solution: '统计回文子串的个数（不同位置算不同子串）。\n\n方法一：中心扩展（推荐）\n回文中心有两种：单字符（奇长度，n 个）和字符间隙（偶长度，n-1 个），共 2n-1 个中心。\n枚举每个中心 l/r，向两边扩散：s[l] == s[r] 时计数 +1，l-- r++ 继续扩；不等或越界即停。\n\n核心代码：\n  int countSubstrings(string s) {\n      int ans = 0;\n      for (int c = 0; c < s.size(); c++) {\n          ans += expand(s, c, c);          // 奇数长度：单中心\n          ans += expand(s, c, c + 1);      // 偶数长度：双中心\n      }\n      return ans;\n  }\n  int expand(string& s, int l, int r) {\n      int cnt = 0;\n      while (l >= 0 && r < s.size() && s[l] == s[r]) { cnt++; l--; r++; }\n      return cnt;\n  }\n\n方法二：动态规划\ndp[i][j] 表示 s[i..j] 是否回文：\ndp[i][j] = (s[i]==s[j]) && (j-i<2 || dp[i+1][j-1])\n按子串长度从小到大枚举，计数所有 true。O(n²) 空间。\n\n方法三：Manacher 算法\nO(n) 级别解法，插入 \'#\' 统一奇偶，维护最右回文边界。本题 n ≤ 1000 不需要，掌握前两种即可。\n\n时间复杂度 O(n²)，方法一空间 O(1)。',
    keyDifficulties: '1. 中心总数是 2n-1：n 个字符中心 + n-1 个空隙中心，漏掉空隙中心会丢失所有偶长度回文\n2. 中心扩展法 l/r 的初值：奇中心 l=r=i；偶中心 l=i, r=i+1，两种写法别混\n3. DP 枚举顺序必须按「长度递增」，dp[i+1][j-1] 依赖更短的子串已算好\n4. 计数口径：「不同下标位置的相同子串分别计数」，与 5 题求最长回文的要求不同',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 66, number: 128, title: '最长连续序列', titleEn: 'Longest Consecutive Sequence', difficulty: '中等',
    knowledge: ['哈希表', 'unordered_set'],
    solution: '要求 O(n) 找出最长连续数字序列长度（如 100,4,200,1,3,2 → 4）。\n\n方法一：哈希集合（推荐）\n1. 全部数字放入 unordered_set（同时自动去重）\n2. 遍历集合中每个数 x：只有当 x-1 不在集合里时，x 才是某段连续序列的「起点」\n3. 从起点开始向上数 x+1, x+2, ... 直到不在集合中，更新最长长度\n\n为什么是 O(n)：每个数只会被「起点枚举」和「向上数」各访问常数次——不是起点的数直接被跳过，向上数的过程每个数只发生一次。\n\n核心代码：\n  int longestConsecutive(vector<int>& nums) {\n      unordered_set<int> st(nums.begin(), nums.end());\n      int ans = 0;\n      for (int x : st) {\n          if (st.count(x - 1)) continue;   // 只从序列起点开始数，保证 O(n)\n          int y = x;\n          while (st.count(y + 1)) y++;\n          ans = max(ans, y - x + 1);\n      }\n      return ans;\n  }\n\n方法二：排序\n排序后线性扫一遍统计连续段（注意跳过重复数字）。O(n log n)，能过但不满题意。\n\n时间复杂度 O(n)，空间复杂度 O(n)。',
    keyDifficulties: '1. 「只从起点开始数」是 O(n) 的关键：判断 x-1 不在集合中，否则每个数都向后数一遍就退化成 O(n²)\n2. 集合要先 insert 完再遍历，边插入边判断会漏数\n3. 重复数字已被集合去重，统计长度时天然不受影响\n4. 排序法遇到相同数字要「跳过」而不是「断开」，[1,2,2,3] 仍是长度 4 的连续序列',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 67, number: 322, title: '零钱兑换', titleEn: 'Coin Change', difficulty: '中等',
    knowledge: ['动态规划', '背包问题', '广度优先搜索'],
    solution: '求凑出 amount 的最少硬币数，每种面额可无限使用（完全背包）。\n\n方法一：动态规划（推荐）\ndp[a] 表示凑出金额 a 的最少硬币数：\ndp[a] = min over coin：dp[a - coin] + 1（a >= coin）\n- dp[0] = 0\n- 初始化其余为「无穷大」(INT_MAX 或 amount+1)，转移前判断 dp[a-coin] 是否可达\n- dp[amount] 仍为无穷大则返回 -1\n\n枚举顺序（完全背包求最少件数）：外层金额、内层硬币，或反之均可，因为求 min 与组合/排列无关。\n\n核心代码：\n  int coinChange(vector<int>& coins, int amount) {\n      vector<int> dp(amount + 1, amount + 1);  // amount+1 充当「无穷大」\n      dp[0] = 0;\n      for (int i = 1; i <= amount; i++)\n          for (int c : coins)\n              if (c <= i) dp[i] = min(dp[i], dp[i - c] + 1);  // 完全背包：每枚可重复用\n      return dp[amount] > amount ? -1 : dp[amount];\n  }\n\n方法二：BFS\n把 0~amount 看作节点，金额 a 通过加一枚硬币到达 a+coin。从 0 做 BFS，第一次到达 amount 的层数就是最少硬币数（最短路性质）。\n\n方法三（错误示范）：贪心每次取最大面额——面额 {1,3,4} 凑 6 时贪心得 4+1+1=3 枚，最优是 3+3=2 枚。\n\n时间复杂度 O(amount × coins)，空间 O(amount)。',
    keyDifficulties: '1. 贪心在任意面额下不成立，必须 DP——这是本题最经典的反直觉点\n2. dp 初始值用 amount+1 当「无穷大」可避免溢出（dp[a-coin]+1 不爆 int）\n3. 转移前必须检查 dp[a-coin] 是否可达，从 INT_MAX 转移 +1 会溢出\n4. dp[0] = 0 是唯一基例；-1 的情况在最后统一判断',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 68, number: 494, title: '目标和', titleEn: 'Target Sum', difficulty: '中等',
    knowledge: ['动态规划', '背包问题', '回溯算法'],
    solution: '给每个数前添加 +/- 号，统计运算结果等于 target 的方案数。\n\n转化（关键一步）：设添加负号的数之和为 neg，则添加正号的数之和为 sum - neg，目标：\n(sum - neg) - neg = target → neg = (sum - target) / 2\n问题转化为：从数组中选数（每个数用一次）使和恰为 neg 的「方案数」——0-1 背包计数。\n\n方法一：0-1 背包计数 DP（推荐）\ndp[j] 表示和为 j 的选法数：\ndp[j] += dp[j - nums[i]]，j 从大到小枚举（0-1 背包滚动数组倒序）\n初始 dp[0] = 1（什么都不选）。\n\n先做合法性检查：sum < target、(sum - target) 为奇数、neg < 0 都直接返回 0。\n\n核心代码：\n  int findTargetSumWays(vector<int>& nums, int target) {\n      int sum = accumulate(nums.begin(), nums.end(), 0);\n      if ((sum + target) % 2 || sum + target < 0) return 0;\n      int pos = (sum + target) / 2;        // 正数集合和 = (sum+target)/2\n      vector<int> dp(pos + 1, 0);\n      dp[0] = 1;                           // 凑 0 有 1 种方案\n      for (int x : nums)\n          for (int j = pos; j >= x; j--)   // 0-1 背包：倒序防重复\n              dp[j] += dp[j - x];\n      return dp[pos];\n  }\n\n方法二：记忆化搜索\ndfs(i, rest)：前 i 个数凑出 rest 的方案数 = dfs(i+1, rest-nums[i]) + dfs(i+1, rest+nums[i])，memo 去重。\n\n方法三：纯回溯\n不加 memo 的 DFS 枚举所有 2^n 个表达式，n ≤ 20 时能过，但规模大就超时。\n\n时间复杂度 O(n × neg)，空间 O(neg)。',
    keyDifficulties: '1. 转化成子集和 neg=(sum-target)/2 是本题的核心；除不尽（奇数）说明无解要提前返回 0\n2. 0-1 背包滚动数组必须「j 倒序枚举」，正序会把同一物品用多次（变成完全背包）\n3. dp[0]=1 是计数型背包的基例（空集方案），与最值型背包 dp[0]=0 不同\n4. nums 中含 0 时正负号结果相同，DP 计数天然涵盖（0 选或不选都贡献方案），无需特判',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 69, number: 438, title: '找到字符串中所有字母异位词', titleEn: 'Find All Anagrams in a String', difficulty: '中等',
    knowledge: ['滑动窗口', '哈希表', 'vector'],
    solution: '找 s 中所有是 p 的异位词的子串起点（定长窗口 = p 的长度）。\n\n方法一：定长滑动窗口 + 计数数组（推荐）\n1. need[26] 统计 p 的字母频次；window[26] 统计当前窗口频次\n2. 右指针 right 依次扩张：每纳入一个字符 window[c]++\n3. 窗口长度超过 p.size() 时，左指针右移并把移出的字符 window[c]--\n4. 窗口长度恰等于 p.size() 且 window == need（vector 可直接 == 比较）时记录左端点\n\n核心代码：\n  vector<int> findAnagrams(string s, string p) {\n      vector<int> need(26, 0), win(26, 0), ans;\n      for (char c : p) need[c - \'a\']++;\n      int k = p.size();\n      for (int i = 0; i < s.size(); i++) {\n          win[s[i] - \'a\']++;\n          if (i >= k) win[s[i - k] - \'a\']--;   // 定长窗口：左端出窗\n          if (win == need) ans.push_back(i - k + 1);\n      }\n      return ans;\n  }\n\n方法二：滑动窗口 + 欠账计数（免比较）\n维护 differ：窗口与 need 频次不同的字母数。纳入/移出字符时增减对应频次并维护 differ，differ == 0 即命中。把 O(26) 的数组比较降到 O(1)。\n\n方法三：排序暴力\n枚举每个起点把子串排序后与 sort 后的 p 比较，O(n·m log m)，仅作对照。\n\n时间复杂度 O(n)（方法二，均摊），空间复杂度 O(26) = O(1)。',
    keyDifficulties: '1. 窗口是「定长」的（= p 长度），用「右指针进、超长左指针收」的写法最不容易错\n2. vector<int>(26) 可以整体 == 比较，手写循环比较时注意不要漏字母\n3. 记录的是「子串起点」即左指针位置，别把右指针记进答案\n4. p 比 s 长直接返回空，这个边界先判能省一大段逻辑',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 70, number: 437, title: '路径总和 III', titleEn: 'Path Sum III', difficulty: '中等',
    knowledge: ['前缀和', '深度优先搜索', '哈希表'],
    solution: '统计「路径方向只能向下、和等于 targetSum」的路径条数。\n\n方法一：前缀和 + 哈希表（推荐，树上版 560 题）\n节点到根路径上：节点 x 的路径和 pre(x)。任意下向路径 (a→b) 的和 = pre(b) - pre(a 的父节点)。\nDFS 时维护 unordered_map<long, int> cnt：「从根到当前节点路径上每个前缀和出现的次数」：\n1. 进入节点：cur += node->val；答案累加 cnt[cur - target]\n2. 先把 cnt[cur - target] 累加（注意先查再把自己加入），再把 cnt[cur]++\n3. 递归左右子树\n4. 回溯（关键）：cnt[cur]--，撤销本节点贡献，防止跨分支误配\n\ncnt 初始 {0:1}（空前缀，对应从根出发的路径）。\n\n核心代码：\n  int pathSum(TreeNode* root, int targetSum) {\n      unordered_map<long, int> pre{{0, 1}};    // 前缀和 0 出现 1 次（空前缀）\n      return dfs(root, 0, targetSum, pre);\n  }\n  int dfs(TreeNode* node, long cur, int target, unordered_map<long,int>& pre) {\n      if (!node) return 0;\n      cur += node->val;\n      int cnt = pre.count(cur - target) ? pre[cur - target] : 0;  // 历史前缀可配对数\n      pre[cur]++;\n      cnt += dfs(node->left, cur, target, pre) + dfs(node->right, cur, target, pre);\n      pre[cur]--;                          // 回溯：离开本支路要撤销\n      return cnt;\n  }\n\n方法二：双重 DFS\n以每个节点为起点 DFS 数目标和路径，O(n²)，无额外空间但大数据会慢。\n\n时间复杂度 O(n)，空间复杂度 O(n)。',
    keyDifficulties: '1. 回溯时必须 cnt[cur]-- 撤销，否则左子树的前缀和会匹配到右子树（路径必须连续向下）\n2. 前缀和与 target 都可能为负/溢出，用 long long\n3. cnt 初始放 {0,1}：路径从根开始时 pre(b) == target 直接命中，漏了会少算\n4. 「先查后插」顺序：把自己加入集合前先查询，否则路径长度为 0 的情况（target=0）会多算',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 71, number: 416, title: '分割等和子集', titleEn: 'Partition Equal Subset Sum', difficulty: '中等',
    knowledge: ['动态规划', '背包问题'],
    solution: '判断能否把数组分成两个子集使各自和相等——经典 0-1 背包可行性问题。\n\n转化：设总和 sum，若 sum 为奇数直接 false；否则问题变为「能否从数组中选出一些数，和恰为 sum/2」（另一部分自然也是 sum/2）。\n\n方法一：0-1 背包布尔 DP（推荐）\ndp[j] 表示「和为 j 的子集是否存在」：\ndp[j] = dp[j] || dp[j - nums[i]]，j 从大到小枚举（倒序防重复选取）\n初始 dp[0] = true。答案 dp[target]，target = sum/2。\n\n倒序的原因：一维滚动数组下，正序枚举会让 dp[j - nums[i]] 已经包含本轮 nums[i]，等于同一元素被选两次。\n\n核心代码：\n  bool canPartition(vector<int>& nums) {\n      int sum = accumulate(nums.begin(), nums.end(), 0);\n      if (sum % 2) return false;\n      int half = sum / 2;\n      vector<bool> dp(half + 1, false);\n      dp[0] = true;\n      for (int x : nums)\n          for (int j = half; j >= x; j--)  // 0-1 背包倒序，防重复选取\n              dp[j] = dp[j] || dp[j - x];\n      return dp[half];\n  }\n\n方法二：二维 DP\ndp[i][j] 表示前 i 个数能否凑出 j，转移同上但空间 O(n·target)。\n\n方法二（可选优化）：bitset 压位\nbitset<10001> dp; dp[0]=1; 每个数 dp |= dp << nums[i]。速度极快，n 大时明显。\n\n时间复杂度 O(n × target)，空间 O(target)。',
    keyDifficulties: '1. sum 为奇数先返回 false；单个数大于 target 时该数必然放不进任何一半也可剪枝\n2. 一维 0-1 背包的 j 必须「倒序」——这是与完全背包（正序）最容易混的点\n3. dp[j-nums[i]] 的下标可能为负：j 从 target 到 nums[i] 枚举即可避免\n4. 判断的是「恰好等于 target」的存在性，不是「不超过 target」的可达性，两者在正数场景等价但口径要清楚',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 72, number: 406, title: '根据身高重建队列', titleEn: 'Queue Reconstruction by Height', difficulty: '中等',
    knowledge: ['贪心算法', '排序'],
    solution: 'people[i] = [h_i, k_i]：h_i 身高，k_i 前面恰有 k_i 个身高 >= h_i 的人。重建队列。\n\n方法一：排序 + 按规则插入（推荐）\n贪心策略：先处理「个子高、要求少」的人，他们一旦就位，后面矮的人怎么插都不影响他们的 k 值。\n1. 排序：h 降序；h 相同时 k 升序\n2. 依次把每个人插入到「当前队列的第 k 个位置」：\n   - 已就位的人都比当前人高（或同高但 k 更小已排好）\n   - 插到下标 k 处，其前面恰好 k 个 >= 他的人，且插入他不会破坏已就位的人（他们更高、k 已满足）\n\n举例：[[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]] → 排序 [7,0][7,1][6,1][5,0][5,2][4,4] → 逐个插入得 [[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]。\n\n时间复杂度 O(n²)（vector 插入 O(n)），空间 O(n)（或原地）。\n\n核心代码：\n  vector<vector<int>> reconstructQueue(vector<vector<int>>& people) {\n      sort(people.begin(), people.end(), [](auto& a, auto& b) {\n          return a[0] > b[0] || (a[0] == b[0] && a[1] < b[1]);  // 身高降序，k 升序\n      });\n      vector<vector<int>> ans;\n      for (auto& p : people) ans.insert(ans.begin() + p[1], p);  // 按 k 插入\n      return ans;\n  }\n\n方法二：树状数组/线段树优化插入\n把「插到第 k 个空位」用第 k 个空位定位（BIT 上二分找第 k 个空位），整体 O(n log n)。进阶掌握。',
    keyDifficulties: '1. 排序规则「h 降序、同 h 时 k 升序」缺一不可：同高时先插 k 小的，否则先插的人会数出多余的高个子\n2. 插入位置是「下标 k」，直接 vector.insert(ans.begin()+k, p)，不要试图交换\n3. 正确性直觉：高的人先站定后，矮的人插入任何位置都不改变「前面 >= 自己身高」的计数\n4. O(n²) 是标准解法；优化版用「第 k 个空位」技巧，直接按下标插入在空位场景下是错的',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 73, number: 399, title: '除法求值', titleEn: 'Evaluate Division', difficulty: '中等',
    knowledge: ['并查集', '深度优先搜索', '广度优先搜索', '哈希表'],
    solution: '给出若干 a/b = value 的等式，查询 x/y 的值；不存在返回 -1。\n\n方法一：带权并查集（推荐）\n节点是字符串变量（用哈希表映射到编号），边权是「到父节点的倍数」：\n1. union(a, b, w)：a/b = w。把 a 所在树挂到 b 所在树下，路径上倍数相乘维护 w[a] = 到新根的总倍数\n2. find(x) 路径压缩：w[x] = w[x] * w[parent[x]]，递归更新后 parent[x] = 根\n3. query(x, y)：x、y 同根则答案 w[x] / w[y]；不同根或未出现返回 -1.0\n\n原理：w[x] 表示 x = w[x] × root，则 x/y = w[x]/w[y]。\n\n核心代码：\n  vector<double> calcEquation(vector<vector<string>>& eqs, vector<double>& vals,\n                              vector<vector<string>>& queries) {\n      unordered_map<string, vector<pair<string,double>>> g;\n      for (int i = 0; i < eqs.size(); i++) {\n          g[eqs[i][0]].push_back({eqs[i][1], vals[i]});        // a/b = v\n          g[eqs[i][1]].push_back({eqs[i][0], 1.0 / vals[i]});  // b/a = 1/v\n      }\n      vector<double> ans;\n      for (auto& q : queries) {\n          unordered_set<string> vis;\n          ans.push_back(dfs(g, q[0], q[1], vis));\n      }\n      return ans;\n  }\n  double dfs(unordered_map<string, vector<pair<string,double>>>& g,\n             string cur, string& dst, unordered_set<string>& vis) {\n      if (!g.count(cur) || !g.count(dst)) return -1.0;\n      if (cur == dst) return 1.0;\n      vis.insert(cur);\n      for (auto& [nx, w] : g[cur]) {\n          if (vis.count(nx)) continue;\n          double r = dfs(g, nx, dst, vis);\n          if (r > 0) return r * w;         // 沿途权值相乘\n      }\n      return -1.0;\n  }\n\n方法二：建图 + BFS/DFS\n把等式建成有向带权图（a→b 权 w，b→a 权 1/w），每次查询从 x 出发搜到 y，路径上权连乘。逐查询独立，简单直观。\n\n时间复杂度：均摊 O((E+Q)·α)；方法二每次查询 O(E)。',
    keyDifficulties: '1. 带权并查集的权是「相对根的倍数」，路径压缩时必须同步乘：w[x] = w[x]*w[fa[x]]\n2. union 时合并方向的倍数推导：a/ra = w[a], b/rb = w[b]，a/b=v → w[ra] = w[b]*v/w[a]\n3. 查询前先判断「变量是否存在」（哈希表找不到直接 -1.0），否则空指针\n4. 方法二建图是双向边（正权 + 倒数），漏反向边 DFS 到不了头',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 74, number: 394, title: '字符串解码', titleEn: 'Decode String', difficulty: '中等',
    knowledge: ['stack', '递归'],
    solution: '将 k[encoded_string] 形式展开，如 3[a2[c]] → accaccacc。\n\n方法一：双栈（推荐）\n一个数字栈 numSt，一个字符串栈 strSt，维护当前正在拼的字符串 cur 和当前数字 num：\n1. 遇到数字：num = num*10 + d（多位数累计）\n2. 遇到 \'[\'：把 (num, cur) 分别压栈，然后 num=0, cur=""（开启新的一层）\n3. 遇到字母：cur += c\n4. 遇到 \']\'：弹出 numSt 栈顶 k 和 strSt 栈顶 pre，cur = pre + cur 重复 k 次\n5. 结束后 cur 即答案\n\n核心代码：\n  string decodeString(string s) {\n      stack<int> numSt; stack<string> strSt;\n      string cur; int num = 0;\n      for (char c : s) {\n          if (isdigit(c)) num = num * 10 + (c - \'0\');\n          else if (c == \'[\') { numSt.push(num); strSt.push(cur); num = 0; cur.clear(); }\n          else if (c == \']\') {\n              int k = numSt.top(); numSt.pop();\n              string pre = strSt.top(); strSt.pop();\n              while (k--) pre += cur;      // 前层串 + 当前串重复 k 次\n              cur = pre;\n          }\n          else cur += c;\n      }\n      return cur;\n  }\n\n方法二：递归下降\n定义 decode(s, i) 解析从 i 开始的一段，遇 \']\' 返回；遇到数字读出 k 后递归解析括号内，再重复拼接。逻辑与双栈等价，用函数栈代替显式栈。\n\n时间复杂度 O(|输出串| × maxK)（最坏），空间 O(嵌套深度)。',
    keyDifficulties: '1. 数字可能是多位数（如 12[ab]），必须 num = num*10 + d 累计，不能只读一个字符\n2. 遇 \'[\' 时「先保存现场再清零」：旧的 cur 压栈、num 清 0、cur 清空\n3. \']\' 结算时重复的是「本层 cur」，拼接顺序是 pre + 本层重复结果，方向别反\n4. 输入保证合法（括号配对），无需处理非法格式；递归版注意用引用/返回值同步下标 i',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 75, number: 347, title: '前 K 个高频元素', titleEn: 'Top K Frequent Elements', difficulty: '中等',
    knowledge: ['哈希表', '堆', '桶排序', '快速选择'],
    solution: '返回数组中出现频率前 k 高的元素。\n\n方法一：哈希计数 + 小顶堆（推荐）\n1. unordered_map 统计每个数出现次数\n2. 维护大小为 k 的小顶堆（按频次比较）：新元素频次 > 堆顶频次则弹出堆顶并入堆\n3. 最终堆里就是频次前 k 大的元素\n\nC++ priority_queue<pair<int,int>, vector<...>, greater<>> 存 (频次, 元素)。\n\n核心代码：\n  vector<int> topKFrequent(vector<int>& nums, int k) {\n      unordered_map<int,int> cnt;\n      for (int x : nums) cnt[x]++;\n      using P = pair<int,int>;\n      priority_queue<P, vector<P>, greater<P>> pq;   // 小顶堆，按频次\n      for (auto& [x, c] : cnt) {\n          pq.push({c, x});\n          if (pq.size() > k) pq.pop();     // 只留频次最高的 k 个\n      }\n      vector<int> ans;\n      while (!pq.empty()) { ans.push_back(pq.top().second); pq.pop(); }\n      return ans;\n  }\n\n方法二：桶排序 O(n)\n频次最大不超过 n：建 n+1 个桶，把每个元素放进「频次桶」，从高频桶往低频桶收集直到取满 k 个。理论最优 O(n)。\n\n方法三：快速选择\n把 (元素, 频次) 数组按频次做 partition，找第 k 大频次的分界，左边即答案。期望 O(n)。\n\n时间复杂度：堆 O(n log k)、桶 O(n)、快选期望 O(n)；空间 O(n)。',
    keyDifficulties: '1. 只要前 k 个而不要求有序，堆大小保持 k 即可，不必全量入堆（全量是 O(n log n)）\n2. 桶排序的下标是「频次」（范围 1~n），桶里装元素——与计数排序方向相反\n3. 堆的比较对象是频次（pair 的 first），元素值本身不参与比较\n4. 答案顺序题目通常不要求；若要求按频次降序输出，堆弹出后还要逆置一次',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 76, number: 337, title: '打家劫舍 III', titleEn: 'House Robber III', difficulty: '中等',
    knowledge: ['二叉树', '动态规划', '深度优先搜索'],
    solution: '二叉树形态的房屋，直接父子不能同时偷，求最大收益——树形 DP 入门题。\n\n方法一：树形 DP（推荐）\n后序遍历，每个节点返回二元组 {rob, skip}：\n- rob = 该节点偷：左右孩子都不能偷 → node->val + left.skip + right.skip\n- skip = 该节点不偷：左右孩子各自可偷可不偷 → max(left.rob, left.skip) + max(right.rob, right.skip)\n\n根节点返回 max(rob, skip) 即答案。\n\n为什么必须后序：父节点的决策依赖子节点的两个状态，必须先算完子树。\n\n核心代码：\n  int rob(TreeNode* root) {\n      auto [take, skip] = dfs(root);\n      return max(take, skip);\n  }\n  // 返回 {偷当前节点的最大收益, 不偷当前节点的最大收益}\n  pair<int,int> dfs(TreeNode* node) {\n      if (!node) return {0, 0};\n      auto l = dfs(node->left), r = dfs(node->right);\n      int take = node->val + l.second + r.second;              // 偷我，孩子都不能偷\n      int skip = max(l.first, l.second) + max(r.first, r.second);  // 不偷我，孩子随意\n      return {take, skip};\n  }\n\n方法二：记忆化搜索\ndfs(node, canRob)：偷/不偷两种转移取 max，用哈希表缓存 (节点, 状态) 的结果。没有缓存是 O(2^n) 会超时。\n\n时间复杂度 O(n)，空间复杂度 O(n)（递归栈 + 无重复计算）。',
    keyDifficulties: '1. 「不偷当前节点」不代表孩子必须偷——孩子仍可自由选择，是 max(left.rob, left.skip)，写成 left.rob 会丢解\n2. 每个节点只返回两个值（偷/不偷），由父节点决策时组合，不要在节点内做全局选择\n3. 必须后序遍历（先子后父）；空节点返回 {0, 0}\n4. 与 198 对比记忆：链式 DP 是「上一家偷没偷」，树形 DP 是「孩子偷没偷」，本质同构',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 77, number: 309, title: '买卖股票的最佳时机含冷冻期', titleEn: 'Best Time to Buy and Sell Stock with Cooldown', difficulty: '中等',
    knowledge: ['动态规划', '状态机', '滚动数组'],
    solution: '可多次交易，但卖出后有一天冷冻期（第二天不能买）。求最大利润。\n\n方法一：状态机 DP（推荐）\n每天三种状态：\n- hold[i]：第 i 天结束时「持有股票」的最大利润\n- sold[i]：第 i 天刚卖出（处于冷冻期）的最大利润\n- rest[i]：第 i 天不持有且不在冷冻期（可自由行动）的最大利润\n\n转移：\nhold[i] = max(hold[i-1], rest[i-1] - prices[i])   （继续持有 / 今天买入，买入前一天必须是 rest）\nsold[i] = hold[i-1] + prices[i]                    （今天卖出）\nrest[i] = max(rest[i-1], sold[i-1])                （继续观望 / 昨天卖出今天冷冻结束）\n\n初始：hold[0] = -prices[0]，sold[0] = 0，rest[0] = 0。答案 = max(sold[n-1], rest[n-1])。\n\n三个变量滚动即可 O(1) 空间。\n\n核心代码：\n  int maxProfit(vector<int>& prices) {\n      int hold = INT_MIN, sold = 0, rest = 0;  // 持股 / 今天刚卖 / 冷冻或观望\n      for (int p : prices) {\n          int prevSold = sold;\n          sold = hold + p;                 // 卖出，明天进冷冻\n          hold = max(hold, rest - p);      // 只有非冷冻才能买\n          rest = max(rest, prevSold);      // 冷冻结束后转入观望\n      }\n      return max(sold, rest);\n  }\n\n时间复杂度 O(n)，空间复杂度 O(1)。',
    keyDifficulties: '1. 冷冻期体现在「买入只能从 rest 转移」：hold 的来源不能是 sold（刚卖不能立刻买）\n2. 三状态的语义要互斥完备：持有 / 刚卖冷冻中 / 空仓自由，漏掉中间态就会写错转移\n3. 答案在「不持有」的两个状态里取 max，持有股票的最后一天不可能是最优\n4. 滚动更新顺序：先算 sold（用旧 hold），或全部用上一天快照后再覆盖，避免状态串味',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 78, number: 300, title: '最长递增子序列', titleEn: 'Longest Increasing Subsequence', difficulty: '中等',
    knowledge: ['动态规划', '贪心算法', '二分查找'],
    solution: '求最长严格递增子序列（LIS）的长度。\n\n方法一：DP O(n²)（推荐先掌握）\ndp[i] = 以 nums[i] 结尾的 LIS 长度：\ndp[i] = max(dp[j]) + 1，对所有 j < i 且 nums[j] < nums[i]\n答案取所有 dp[i] 的最大值。\n\n核心代码：\n  int lengthOfLIS(vector<int>& nums) {\n      vector<int> tail;                    // tail[i]：长度 i+1 的 LIS 的最小结尾\n      for (int x : nums) {\n          auto it = lower_bound(tail.begin(), tail.end(), x);\n          if (it == tail.end()) tail.push_back(x);   // 能延长\n          else *it = x;                            // 替换为更小结尾，更利于后续\n      }\n      return tail.size();\n  }\n\n方法二：贪心 + 二分 O(n log n)\n维护数组 tails：tails[k] = 「长度为 k+1 的递增子序列的最小可能结尾」。\n遍历每个 x：\n- x 大于 tails 末尾 → 直接追加（LIS 变长）\n- 否则在 tails 中二分找「第一个 >= x 的位置」替换之（让同长度序列结尾更小，未来更容易接上）\n\ntails 的长度即 LIS 长度。注意 tails 本身不是某个具体 LIS。\n\n时间复杂度 O(n²) / O(n log n)，空间 O(n)。',
    keyDifficulties: '1. dp 定义是「以 i 结尾」，答案要扫全局 max，不是 dp[n-1]\n2. 贪心+二分中 tails 的含义是「同长度下最小结尾」，替换操作不改变长度只让后续更优\n3. 二分找的是「第一个 >= x」（lower_bound），因为题目要求严格递增；非严格递增要用 upper_bound\n4. tails 不是原数组的一个真实子序列，只用于求长度；要输出方案需额外记录前驱',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 79, number: 287, title: '寻找重复数', titleEn: 'Find the Duplicate Number', difficulty: '中等',
    knowledge: ['快慢指针', '二分查找', '位运算'],
    solution: 'n+1 个数在 [1, n] 内，恰有一个重复（可重复多次），不修改数组、O(1) 空间找出它。\n\n方法一：快慢指针看做链表（推荐）\n把 i → nums[i] 视作链表 next 指针。因为值域 [1,n] 且存在重复值 t，t 有两个下标指向它，链表必成环，且入环点就是重复数字 t。\n1. fast 2 步 slow 1 步找相遇\n2. 一指针回到起点 0，两指针同速前进，再次相遇处即重复数（142 题推导完全复用）\n\n核心代码：\n  int findDuplicate(vector<int>& nums) {\n      int slow = nums[0], fast = nums[0];\n      do { slow = nums[slow]; fast = nums[nums[fast]]; } while (slow != fast);  // 相遇\n      slow = nums[0];\n      while (slow != fast) { slow = nums[slow]; fast = nums[fast]; }  // 入环点即重复数\n      return slow;\n  }\n\n方法二：二分答案（抽屉原理）\n二分枚举「答案 x」，统计 nums 中 <= x 的个数 cnt：\n- 若 cnt > x，重复数 <= x，往左收\n- 否则往右收\n对 [1,n] 中每个 x，若无重复则 <=x 的个数恰好 x；重复让计数超出。O(n log n)。\n\n方法三：位运算\n枚举每个二进制位：统计 nums 中该位为 1 的个数与 1..n 中该位为 1 的个数比较，超出则重复数该位为 1。O(n log n)。\n\n时间复杂度：方法一 O(n)、方法二三 O(n log n)；空间均 O(1)。',
    keyDifficulties: '1. 「值当下标」构链表是本题的抽象关键：重复值 = 被两个下标指向 = 链表入环点\n2. 起点 0 一定在环外（值域 [1,n]，没有下标指向 0），保证了 142 定位法的适用性\n3. 二分答案的二分对象是「数值范围 [1,n]」不是数组下标，数组本身无序也可用\n4. 题目禁用了「排序后看相邻相等」和「哈希表」两条后路，别写上去',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 80, number: 279, title: '完全平方数', titleEn: 'Perfect Squares', difficulty: '中等',
    knowledge: ['动态规划', '背包问题', '广度优先搜索'],
    solution: '求和为 n 的完全平方数（1,4,9,...）的最少个数。\n\n方法一：完全背包 DP（推荐）\ndp[i] 表示凑出 i 的最少平方数个数：\ndp[i] = min(dp[i - j*j]) + 1，对所有 j*j <= i\n初始 dp[0] = 0，其余为无穷大。\n「物品」是每个平方数 j*j，可无限使用——标准完全背包（求最少件数）。\n\n核心代码：\n  int numSquares(int n) {\n      vector<int> dp(n + 1, INT_MAX);\n      dp[0] = 0;\n      for (int i = 1; i <= n; i++)\n          for (int j = 1; j * j <= i; j++)   // 枚举最后用的平方数\n              dp[i] = min(dp[i], dp[i - j*j] + 1);\n      return dp[n];\n  }\n\n方法二：BFS\n从 n 出发，每层减去一个平方数，第一次到达 0 的层数即答案（最短路视角）。与零钱兑换的 BFS 完全同构。\n\n方法三：数学定理\n拉格朗日四平方定理：任何数最多 4 个平方数；勒让德三平方定理排除 n = 4^a(8b+7)。\n先判 n 是否完全平方（1 个），再判两平方和（2 个），再排除三平方（3 个），否则 4 个。O(√n) 最快但偏数学。\n\n时间复杂度 O(n·√n)，空间 O(n)。',
    keyDifficulties: '1. 内层枚举的是 j（1 到 sqrt(i)），转移用 dp[i - j*j]，j*j 写成 j 是常见手误\n2. dp 数组「无穷大」初始 + 判断可达，与零钱兑换完全同构（把硬币换成平方数）\n3. 数学法要按 1→2→3→4 的顺序判断，4 是兜底（四平方定理保证不超过 4）\n4. BFS 版本 visited 标记别漏，否则同一中间值被重复扩展',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 81, number: 253, title: '会议室 II', titleEn: 'Meeting Rooms II', difficulty: '中等',
    knowledge: ['堆', '贪心算法', '排序'],
    solution: '给定会议时间区间，求至少需要多少间会议室（同一时刻并行的最大会议数）。\n\n方法一：最小堆（推荐）\n1. 按「开始时间」升序排序\n2. 用小顶堆保存「各会议室的结束时间」：\n   - 新会议开始时间 >= 堆顶（最早结束的会议室空闲）→ 弹出堆顶，复用该会议室\n   - 否则必须新开一间\n3. 新会议（或复用）的结束时间入堆\n4. 遍历结束，堆的大小即所需会议室数\n\n核心代码：\n  int minMeetingRooms(vector<vector<int>>& intervals) {\n      vector<pair<int,int>> ev;\n      for (auto& m : intervals) { ev.push_back({m[0], 1}); ev.push_back({m[1], -1}); }\n      sort(ev.begin(), ev.end(), [](auto& a, auto& b) {\n          return a.first < b.first || (a.first == b.first && a.second < b.second);  // 同时刻先结束再开始\n      });\n      int cur = 0, ans = 0;\n      for (auto& [t, d] : ev) { cur += d; ans = max(ans, cur); }  // 同时在开的会 = 所需房间\n      return ans;\n  }\n\n方法二：扫描线（差分计数）\n把每个区间拆成两个事件：开始时间 +1、结束时间 -1，结束事件排在同时刻开始事件之前。\n事件按时间排序后依次累加 delta，过程中的最大值即答案。\n\n方法三：分别排序首尾\nstarts、ends 各自排序；双指针扫描，start < end 时房间数 +1，否则房间数 -1 且 end 指针右移，记录峰值。\n\n时间复杂度 O(n log n)，空间 O(n)（堆/事件数组）。',
    keyDifficulties: '1. 堆里存「结束时间」，弹堆顶的条件是「新会议开始 >= 最早结束」（>= 表示不冲突，端点相接可复用）\n2. 扫描线同时刻的排序：先处理结束再处理开始，否则「上会刚结束、下会同时开始」会被算成需要两间\n3. 方法三 starts/ends 独立排序后失去配对关系，但统计「最大并发数」仍正确——别试图用它还原哪场会在哪间\n4. 这是区间类问题通用模板：会议安排、任务调度、最少站台数都是同一题',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 82, number: 240, title: '搜索二维矩阵 II', titleEn: 'Search a 2D Matrix II', difficulty: '中等',
    knowledge: ['二分查找', '矩阵操作', '分治'],
    solution: '矩阵特性：每行从左到右升序、每列从上到下升序（不是「前一 行末尾 < 下一行开头」，那是 74 题）。\n\n方法一：右上角出发（推荐，O(m+n)）\n从右上角 (0, n-1) 开始：\n- 当前值 > target：这一列下面更大，排除该列，左移 j--\n- 当前值 < target：这一行左边更小，排除该行，下移 i++\n- 相等返回 true；走出边界返回 false\n\n每步排除一行或一列，最多 m+n 步。左下角出发同理对称。\n\n核心代码：\n  bool searchMatrix(vector<vector<int>>& matrix, int target) {\n      int m = matrix.size(), n = matrix[0].size();\n      int i = 0, j = n - 1;                // 从右上角出发\n      while (i < m && j >= 0) {\n          if (matrix[i][j] == target) return true;\n          else if (matrix[i][j] > target) j--;   // 太大：本列下面更大，整列排除\n          else i++;                              // 太小：本行左边更小，整行排除\n      }\n      return false;\n  }\n\n方法二：每行二分\n对每行做二分查找，O(m log n)。当 m 远小于 n 时反而更快。\n\n方法三：分治\n从矩阵中心划四象限，递归排除左上（全小于）与右下（全大于），对左下、右上继续。理论 O((mn)^log4 3)，实用性一般。\n\n时间复杂度 O(m+n)，空间 O(1)。',
    keyDifficulties: '1. 起点必须是右上角或左下角——这两个位置的两个移动方向分别对应「严格大于/小于」，能确定地排除一行或一列\n2. 从左上或右下出发无法决策（两个方向都增大/减小），这是本题与普通二分的最大差异\n3. 与 74 题区分：74 题矩阵「每行首 > 上一行尾」可整体拉平成一位数组二分 O(log(mn))；本题行列各自有序但整体无序，只能 O(m+n)\n4. 移动条件写全（大于、小于、相等三态），边界 i/j 越界判断放循环条件里',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 83, number: 538, title: '把二叉搜索树转换为累加树', titleEn: 'Convert BST to Greater Tree', difficulty: '中等',
    knowledge: ['二叉搜索树', '深度优先搜索', '递归'],
    solution: '把 BST 每个节点的值改为「原树中大于等于该节点值的所有节点值之和」。\n\n方法一：反中序遍历（推荐）\n关键观察：BST 的中序遍历（左根右）是升序；反过来「右根左」是降序。\n按右根左顺序遍历，用累加器 sum：\n1. 先递归右子树\n2. sum += node->val；node->val = sum\n3. 再递归左子树\n\n遍历完后每个节点恰好变成「自身 + 所有更大节点之和」。\n\n核心代码：\n  int sum = 0;\n  TreeNode* convertBST(TreeNode* root) {\n      if (!root) return nullptr;\n      convertBST(root->right);             // 先右：从大到小访问\n      sum += root->val;\n      root->val = sum;                     // 大于等于本值的所有节点值之和\n      convertBST(root->left);\n      return root;\n  }\n\n方法二：中序遍历存数组再回填\n先左根右遍历得到升序数组，从后往前做后缀和，再第二次遍历按顺序写回。两次遍历、O(n) 额外空间，仅作理解对照。\n\n时间复杂度 O(n)，空间复杂度 O(n)（递归栈，最坏链状树）。',
    keyDifficulties: '1. 遍历顺序是「右 → 根 → 左」（反中序/降序），与常规中序方向相反，容易顺手写错\n2. 累加器更新顺序：先加自身再写回（sum += val; val = sum），两行不能颠倒\n3. 「大于等于」包含自身——节点新值 = 原值 + 比它大的节点值之和，对照示例验证一遍\n4. 递归版空间 O(h)；面试可提迭代版（栈模拟）避免最坏 O(n) 栈深',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 84, number: 560, title: '和为 K 的子数组', titleEn: 'Subarray Sum Equals K', difficulty: '中等',
    knowledge: ['前缀和', '哈希表', 'unordered_map'],
    solution: '统计和恰好为 k 的连续子数组个数（数组含负数，不能滑动窗口）。\n\n方法一：前缀和 + 哈希表（推荐）\n前缀和 pre[i] = nums[0..i-1] 之和，子数组 (j, i] 的和 = pre[i] - pre[j]。\n要 pre[i] - pre[j] == k，即找「之前出现过多少个 pre[j] == pre[i] - k」。\n1. 哈希表 cnt 统计「每个前缀和出现的次数」，初始 cnt[0] = 1（空前缀）\n2. 从左到右累加 cur += nums[i]：\n   - 答案累加 cnt[cur - k]\n   - 再 cnt[cur]++\n3. 结束即答案\n\n「先查再插」顺序保证子数组非空且不把自身算进去。\n\n为什么不能用滑动窗口：数组有负数，窗口和不单调，收缩/扩张的判断失效。\n\n核心代码：\n  int subarraySum(vector<int>& nums, int k) {\n      unordered_map<int,int> pre{{0, 1}};  // 前缀和 0 出现 1 次\n      int sum = 0, ans = 0;\n      for (int x : nums) {\n          sum += x;\n          if (pre.count(sum - k)) ans += pre[sum - k];  // 有多少历史前缀能配出 k\n          pre[sum]++;\n      }\n      return ans;\n  }\n\n时间复杂度 O(n)，空间复杂度 O(n)。',
    keyDifficulties: '1. 哈希表初始必须放 {0: 1}：从下标 0 开头、和恰为 k 的子数组要靠空前缀命中\n2. 顺序是「先查 cnt[cur-k] 再插 cnt[cur]」，反过来会在 k=0 时把空子数组算进去\n3. 前缀和可能很大也可能为负，用 unordered_map 而不是数组计数\n4. 「子数组」是连续的——本题是前缀和的标准应用；若题目改「子序列」就完全不是这一套',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 85, number: 621, title: '任务调度器', titleEn: 'Task Scheduler', difficulty: '中等',
    knowledge: ['贪心算法', '堆', '设计'],
    solution: '同类任务执行后须间隔 n 个冷却时间，求完成所有任务的最少时间。\n\n方法一：贪心公式（推荐）\n设出现次数最多的任务出现 maxCount 次，且出现 maxCount 次的任务有 maxNum 种：\nans = max( (maxCount-1) * (n+1) + maxNum, tasks.size() )\n推导：把最高频任务按间隔 n 摆成 maxCount-1 个完整「组块」，每组块长 n+1；\n最高频任务占每组块的开头，组内剩余空位由其他任务（或 idle）填充；\n出现 maxCount 次的任务共 maxNum 种都要放进最后一列，故加 maxNum。\n若任务总数更多（冷却被填满没有 idle），直接取 tasks.size()。\n\n核心代码：\n  int leastInterval(vector<char>& tasks, int n) {\n      vector<int> cnt(26, 0);\n      for (char c : tasks) cnt[c - \'A\']++;\n      int mx = *max_element(cnt.begin(), cnt.end());\n      int mxCnt = count(cnt.begin(), cnt.end(), mx);        // 几个任务并列最频繁\n      // 以最高频任务为骨架：(mx-1) 个完整槽 + 最后一行\n      int ans = (mx - 1) * (n + 1) + mxCnt;\n      return max(ans, (int)tasks.size());  // 空闲槽全被填满时就是 tasks.size()\n  }\n\n方法二：构造模拟（堆）\n每轮 n+1 个槽位：把当前剩余次数最多的任务依次放入（优先队列按剩余次数取），冷却一轮后次数归还队列。模拟到底即答案，适合理解、代码较繁。\n\n时间复杂度：公式 O(|tasks|)；模拟 O(T log 26)。',
    keyDifficulties: '1. 公式两项取 max：冷却造成的空隙可能被其他任务填满（无 idle），此时由总任务数决定\n2. maxNum 是「并列最高频的任务种类数」，漏乘/漏加是最高频错误\n3. 公式法假设了「最优摆放」：最高频任务先铺骨架、其他任务往缝里塞，剩余任务不足才 idle\n4. 模拟法中「一轮 n+1 个槽」内同一任务只出现一次，取完任务后未执行的槽位就是 idle',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 86, number: 581, title: '最短无序连续子数组', titleEn: 'Shortest Unsorted Continuous Subarray', difficulty: '中等',
    knowledge: ['双指针', '排序'],
    solution: '找出最短的一段连续子数组，只需把它升序排序整个数组就有序。\n\n方法一：排序对照（简单直接）\n拷贝一份排序，与原数组逐位比较：第一个不同的位置 l、最后一个不同的位置 r，答案 r-l+1；完全相同则 0。O(n log n) / O(n)。\n\n核心代码：\n  int findUnsortedSubarray(vector<int>& nums) {\n      int n = nums.size(), l = -1, r = -1;\n      int mx = INT_MIN, mn = INT_MAX;\n      for (int i = 0; i < n; i++) {\n          if (nums[i] >= mx) mx = nums[i]; else r = i;   // 逆序点刷新右边界\n          int j = n - 1 - i;\n          if (nums[j] <= mn) mn = nums[j]; else l = j;   // 反向扫刷新左边界\n      }\n      return r == -1 ? 0 : r - l + 1;\n  }\n\n方法二：双向线性扫描（O(n)，推荐）\n- 从左到右维护「前缀最大值 maxL」：maxL 大于当前元素的位置说明该元素错位，记录最右的这类位置 end\n- 从右到左维护「后缀最小值 minR」：minR 小于当前元素的位置记录最左的这类位置 start\n答案 end - start + 1（end < start 说明已有序，返回 0）。\n\n原理：无序段的右边界 = 最后一个「比前面最大值还小」的元素；左边界 = 最后一个「比后面最小值还大」的元素（从右往左看）。\n\n时间复杂度 O(n)，空间复杂度 O(1)。',
    keyDifficulties: '1. 两次扫描方向别搞反：正向扫 maxL 找 end（右边界），反向扫 minR 找 start（左边界）\n2. 判断条件是「严格大于/小于」：相等的元素不属于错位，不缩短边界\n3. 有序数组要返回 0，用 start > end（或 end 未被更新）判断\n4. 别只找「局部降序段」：[1,3,5,2,4] 的无序段是 [3,5,2,4]，不是相邻逆序对那么简单',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 87, number: 53, title: '最大子数组和', titleEn: 'Maximum Subarray', difficulty: '中等',
    knowledge: ['动态规划', '贪心算法', '分治'],
    solution: '求和最大的连续子数组（至少一个元素）。\n\n方法一：Kadane 算法（贪心/DP，推荐）\n维护 cur = 以当前元素结尾的最大子数组和：\ncur = max(nums[i], cur + nums[i])\n—— 前面的累积 cur 若为负，就丢弃重新从 nums[i] 开段。\n过程中 ans = max(ans, cur)。\n\nDP 视角：dp[i] = max(nums[i], dp[i-1] + nums[i])，与 Kadane 完全一致，cur 即滚动后的 dp。\n\n核心代码：\n  int maxSubArray(vector<int>& nums) {\n      int cur = nums[0], ans = nums[0];\n      for (int i = 1; i < nums.size(); i++) {\n          cur = max(nums[i], cur + nums[i]);   // 另起炉灶 or 续接前面\n          ans = max(ans, cur);\n      }\n      return ans;\n  }\n\n方法二：前缀和\npre 累加，答案 = max(pre[i] - minPre)，minPre 是历史最小前缀和（含 0）。一遍扫描同时维护。\n\n方法三：分治\n线段树四元组思想：区间内的答案 = max(左区间的答案, 右区间的答案, 左区间后缀最大和 + 右区间前缀最大和)。O(n log n)，是线段树维护区间最大子段和的基础。\n\n时间复杂度 O(n)，空间复杂度 O(1)（方法一/二）。',
    keyDifficulties: '1. 全负数组时答案也要有值：ans 初始为 nums[0] 而非 0，且 cur 丢弃旧段时必须保留 nums[i] 本身\n2. Kadane 转移是「接上」还是「另起」的二选一，负累积直接弃——这是它和暴力 O(n²) 的全部区别\n3. 「子数组」必须连续；改成「子序列」就变成把所有正数加起来（53 的经典变形）\n4. 返回的是最大和不是子数组本身；要输出区间需额外记录起止下标',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 88, number: 124, title: '二叉树中的最大路径和', titleEn: 'Binary Tree Maximum Path Sum', difficulty: '困难',
    knowledge: ['二叉树', '递归', '深度优先搜索'],
    solution: '路径可以从任意节点出发、到任意节点结束（不一定过根），节点值可负，求路径和最大值。\n\n方法一：后序遍历 + 全局最大（推荐）\n递归函数 gain(node) 返回「以 node 为起点向下延伸的最大贡献值」：\n1. 空节点贡献 0\n2. 左孩子贡献 leftGain = max(gain(left), 0)——负贡献直接砍掉（不选那一边）\n3. 右孩子贡献 rightGain = max(gain(right), 0)\n4. 经过 node 的最优路径和 = node->val + leftGain + rightGain（拐点在 node，两边都算）\n5. 用它更新全局答案 ans；但向父节点返回时只能「单边」：node->val + max(leftGain, rightGain)\n\n为什么返回值和更新值不同：父节点只能通过一条边连接本子树，路径若在 node 处拐弯就不能再向上延伸。\n\n核心代码：\n  int ans = INT_MIN;\n  int maxPathSum(TreeNode* root) { gain(root); return ans; }\n  int gain(TreeNode* node) {\n      if (!node) return 0;\n      int l = max(gain(node->left), 0), r = max(gain(node->right), 0);  // 负贡献砍掉\n      ans = max(ans, node->val + l + r);     // 拐弯路径在本节点结算\n      return node->val + max(l, r);          // 向上只传单边\n  }\n\n时间复杂度 O(n)，空间复杂度 O(n)（递归栈）。',
    keyDifficulties: '1. 「拐弯路径」在当前节点结算（左+根+右），「向上返回」只能单边（根+max(左,右)）——两者分离是本题核心\n2. 负贡献取 0：子树增益为负时宁可不延伸，max(gain, 0) 别忘\n3. 答案初值设 INT_MIN：全负树（如单节点 -3）答案就是负数，不能初始化为 0\n4. 与 543 直径对比：直径=左高+右高（边数），本题=左增益+根值+右增益（带权），框架完全同构',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 89, number: 312, title: '戳气球', titleEn: 'Burst Balloons', difficulty: '困难',
    knowledge: ['动态规划', '分治', '记忆化搜索'],
    solution: '戳破气球 i 得 nums[left]*nums[i]*nums[right] 分（left/right 是当时相邻的未破气球），求最大总分。\n\n方法一：区间 DP（推荐）\n逆向思考「最后戳哪个」而非「先戳哪个」——最后戳的气球左右邻居是确定的。\n1. 两端补 1：nums 首尾各插 1，设新数组 v，长度 n+2\n2. dp[i][j] 表示「在开区间 (i, j) 内（i、j 两端不戳）把里面全部戳完」的最大得分\n3. 转移：枚举开区间内最后戳的气球 k：\n   dp[i][j] = max(dp[i][j], dp[i][k] + v[i]*v[k]*v[j] + dp[k][j])\n4. 枚举顺序按区间长度从小到大，答案 dp[0][n+1]\n\n为什么逆向：先戳谁会影响邻居关系（状态不独立），最后戳的 k 把问题分成两个互不影响的子区间 (i,k) 与 (k,j)。\n\n核心代码：\n  int maxCoins(vector<int>& nums) {\n      int n = nums.size();\n      vector<int> v(n + 2, 1);\n      for (int i = 0; i < n; i++) v[i + 1] = nums[i];   // 两端补 1\n      vector<vector<int>> dp(n + 2, vector<int>(n + 2, 0));\n      for (int len = 3; len <= n + 2; len++)            // 区间长度递增\n          for (int i = 0; i + len - 1 <= n + 1; i++) {\n              int j = i + len - 1;\n              for (int k = i + 1; k < j; k++)           // k 是开区间 (i,j) 最后戳的\n                  dp[i][j] = max(dp[i][j], dp[i][k] + v[i]*v[k]*v[j] + dp[k][j]);\n          }\n      return dp[0][n + 1];\n  }\n\n方法二：记忆化搜索\ndfs(i, j) 同上定义，memo 数组缓存。本质相同，写起来更自然。\n\n时间复杂度 O(n³)（区间 × 枚举分割点），空间 O(n²)。',
    keyDifficulties: '1. 「最后戳」而不是「先戳」：正向戳破会改变相邻关系，子问题无法独立——逆向是本题唯一突破口\n2. 开区间定义 (i,j)：两端哨兵（补的 1）永远不戳，得分乘的正是开区间的两个端点\n3. 区间长度必须从 3 开始（区间内至少一个气球）、从小到大枚举，保证 dp[i][k]、dp[k][j] 已算好\n4. 得分公式 v[i]*v[k]*v[j] 用的是「当前区间两端」，不是原数组中的物理邻居',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 90, number: 301, title: '删除无效的括号', titleEn: 'Remove Invalid Parentheses', difficulty: '困难',
    knowledge: ['广度优先搜索', '回溯算法', '哈希表'],
    solution: '删除最少的括号使字符串合法，返回所有可能结果。\n\n方法一：BFS 逐层删除（推荐）\n状态是「当前字符串」，每层尝试删掉一个字符：\n1. 从 s 开始，若 s 合法则返回 [s]\n2. 否则对当前层每个字符串，枚举删除每个位置的括号字符生成下一层，用 visited 去重\n3. 第一次出现合法字符串的那一层，收集全部合法结果即答案（再删更多必然不是最少删除）\n\n合法性判断：从左到右计数，左括号 +1 右括号 -1，计数 < 0 立即非法，最终为 0 才合法。\n\n核心代码：\n  vector<string> removeInvalidParentheses(string s) {\n      vector<string> ans;\n      unordered_set<string> vis{s};\n      queue<string> q; q.push(s);\n      bool found = false;\n      while (!q.empty()) {\n          string cur = q.front(); q.pop();\n          if (isValid(cur)) { ans.push_back(cur); found = true; }  // 本层合法即收集\n          if (found) continue;               // 已找到，不再展开更深层\n          for (int i = 0; i < cur.size(); i++) {\n              if (cur[i] != \'(\' && cur[i] != \')\') continue;\n              string nxt = cur.substr(0, i) + cur.substr(i + 1);   // 删一个括号\n              if (!vis.count(nxt)) { vis.insert(nxt); q.push(nxt); }\n          }\n      }\n      return ans;\n  }\n  bool isValid(string& s) {\n      int bal = 0;\n      for (char c : s) {\n          if (c == \'(\') bal++;\n          else if (c == \')\' && --bal < 0) return false;\n      }\n      return bal == 0;\n  }\n\n方法二：DFS + 剪枝计数\n先统计出最少要删的左括号 lremove 与右括号 rremove 数：\ndfs(s, start, lremove, rremove)——从 start 起枚举删除位置，lremove/rremove 减到 0 且串合法时收集答案。\n剪枝：剩余字符数 < lremove+rremove 直接返回；连续相同的括号只尝试删第一个（去重）。\n\n时间复杂度：BFS 最坏 O(n·2^n)；DFS 剪枝后实际很快。',
    keyDifficulties: '1. BFS 的「层」= 已删除字符数，第一层出现合法解即停，保证「最少删除」\n2. visited 集合防重复展开：删除不同位置可能得到相同字符串\n3. 删除枚举只需尝试括号字符（字母删了不改变合法性）\n4. DFS 剪枝版必须先算 lremove/rremove（从右往左扫的配对计数），「同字符跳过」去重不做会超时',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 91, number: 297, title: '二叉树的序列化与反序列化', titleEn: 'Serialize and Deserialize Binary Tree', difficulty: '困难',
    knowledge: ['二叉树', '深度优先搜索', '广度优先搜索', '递归'],
    solution: '把二叉树编码为字符串，并能从字符串还原出原树。\n\n方法一：前序遍历 + null 标记（推荐）\n序列化：\n1. 按前序（根左右）遍历，空节点输出特殊标记（如 "#"）\n2. 每个值后加分隔符（如 ","）：`1,2,#,#,3,4,#,#,5,#,#`\n\n反序列化：\n1. 按逗号 split 成列表/队列\n2. 递归取队首：是 "#" 返回空；否则 new 节点，先递归建左子树再建右子树（与前序对应）\n用队列（或引用下标 i）替代返回值传位置，避免指针混乱。\n\n核心代码：\n  // 序列化：前序 + "#" 占位\n  string serialize(TreeNode* root) {\n      if (!root) return "#,";\n      return to_string(root->val) + "," + serialize(root->left) + serialize(root->right);\n  }\n  // 反序列化：队列消费 token，递归顺序与前序一致\n  TreeNode* deserialize(string data) {\n      queue<string> q;\n      size_t pos = 0;\n      while ((pos = data.find(\',\')) != string::npos) {\n          q.push(data.substr(0, pos)); data.erase(0, pos + 1);\n      }\n      return build(q);\n  }\n  TreeNode* build(queue<string>& q) {\n      string v = q.front(); q.pop();\n      if (v == "#") return nullptr;\n      TreeNode* node = new TreeNode(stoi(v));\n      node->left = build(q); node->right = build(q);\n      return node;\n  }\n\n方法二：层序遍历（BFS）\n与 LeetCode 官方的 [1,2,3,null,4] 格式一致：队列逐层出队，null 也占位输出；反序列化同样用队列逐层挂孩子。代码稍长，直观性更好。\n\n必须记录 null 的原因：只存「存在的值」时，单独靠前序无法区分树形（缺的孩子位置不明确）。\n\n时间复杂度 O(n)，空间复杂度 O(n)。',
    keyDifficulties: '1. 空节点必须显式序列化（# 占位），否则任何单个遍历序列都无法唯一还原树形\n2. 反序列化的递归顺序必须与序列化一致（前序对前序），取走一个 token 就消费掉\n3. 值可能是负数/多位数，分隔符别省略（直接拼字符会在 -12 这类值上出错）\n4. 用队列 + pop 的写法最不易错；用下标 i 时必须用引用或在成员/闭包里共享，局部 int 不会同步',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 92, number: 239, title: '滑动窗口最大值', titleEn: 'Sliding Window Maximum', difficulty: '困难',
    knowledge: ['单调队列', '双端队列', '滑动窗口'],
    solution: '返回每个大小为 k 的滑动窗口的最大值。\n\n方法一：单调队列（推荐，deque 存下标）\n维护一个「下标对应值单调递减」的双端队列：\n1. 右端入队 i 前：把队尾所有值 <= nums[i] 的下标弹出（它们再也不可能当最大值）\n2. 入队 i\n3. 检查队首下标是否滑出窗口（队首 <= i-k 则 pop_front）\n4. i >= k-1 起，队首下标对应的值即窗口最大值\n\n为什么正确：队首始终是窗口内最大值的下标；被弹出的队尾元素比新来的元素小且更早过期，永远没有出头之日。\n\n核心代码：\n  vector<int> maxSlidingWindow(vector<int>& nums, int k) {\n      deque<int> dq;                       // 存下标，对应值单调递减\n      vector<int> ans;\n      for (int i = 0; i < nums.size(); i++) {\n          while (!dq.empty() && nums[dq.back()] <= nums[i]) dq.pop_back();  // 队尾清理\n          dq.push_back(i);\n          if (dq.front() <= i - k) dq.pop_front();   // 队首过期\n          if (i >= k - 1) ans.push_back(nums[dq.front()]);\n      }\n      return ans;\n  }\n\n方法二：堆\n(值, 下标) 入大顶堆；取答案时若堆顶下标已滑出窗口就持续弹出。O(n log n)。\n\n方法三：分块前缀/后缀最大\n按 k 分块，块内扫 preMax（左到右）与 sufMax（右到左），窗口最大 = max(sufMax[窗口左端], preMax[窗口右端])。O(n) 且不用 deque。\n\n时间复杂度 O(n)（方法一，均摊），空间 O(k)。',
    keyDifficulties: '1. 队列存「下标」不存值：判断队首是否滑出窗口需要下标，值取 nums[下标]\n2. 入队前先从队尾弹出所有 <= 当前值的元素——等于的也要弹，否则队首取最大时旧元素可能过期占位\n3. 三个动作的顺序：队尾清理 → 入队 → 队首过期清理 → 取队首；乱序会在边界窗口出错\n4. 与单调栈对比：单调队列多了「队首过期弹出」，因为窗口左边界在移动；两者都保证均摊 O(n)',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 93, number: 42, title: '接雨水', titleEn: 'Trapping Rain Water', difficulty: '困难',
    knowledge: ['双指针', '动态规划', '单调栈'],
    solution: '给定柱高数组，计算能接多少雨水。\n\n核心公式：每个下标 i 的存水 = min(左边最高柱, 右边最高柱) - height[i]。\n\n方法一：动态规划预处理\nleftMax[i]、rightMax[i] 各扫一遍预处理，再逐列累加。O(n)/O(n)，最直观。\n\n核心代码：\n  int trap(vector<int>& height) {\n      int l = 0, r = height.size() - 1, lMax = 0, rMax = 0, ans = 0;\n      while (l < r) {\n          lMax = max(lMax, height[l]);\n          rMax = max(rMax, height[r]);\n          if (lMax < rMax) ans += lMax - height[l++];  // 矮侧水位由自身侧最大值决定\n          else             ans += rMax - height[r--];\n      }\n      return ans;\n  }\n\n方法二：双指针（推荐，O(1) 空间）\nleft、right 从两端向中间走，维护 leftMax、rightMax：\n- 若 leftMax < rightMax：左指针处的存水由 leftMax 决定（右边一定有更高的挡着），累加 leftMax - h[left]，left++\n- 否则对称处理右指针\n正确性：短板一侧的水位只取决于自己这侧的最大值。\n\n方法三：单调栈（横向计算）\n维护高度递减栈：当前柱高于栈顶时，栈顶就是「凹槽底」，弹出并按「宽 × 高」逐层积水：\nwater += (min(h[i], h[栈顶下的元素]) - h[栈顶]) * (i - 栈顶下元素 - 1)\n\n方法一按「列」算，方法三按「层」算，结果一致。\n\n时间复杂度 O(n)，方法一 O(n) 空间、方法二 O(1)。',
    keyDifficulties: '1. 单列存水公式的「左右最高」都不含自身列；min 取短板，减自身高度可能为 0\n2. 双指针移动条件是比较 leftMax 与 rightMax（不是 h[left] 与 h[right]），移动矮的一侧\n3. 单调栈是「横向按层积水」：弹出凹底后，宽 = 当前 i 与新栈顶之间的空隙，高 = 两边较矮者减凹底\n4. 与 11 题盛水容器区分：那是两根柱子围成的矩形面积，没有「中间凹地」概念，公式完全不同',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 94, number: 32, title: '最长有效括号', titleEn: 'Longest Valid Parentheses', difficulty: '困难',
    knowledge: ['stack', '动态规划', '双指针'],
    solution: '求最长的「格式合法且连续」的括号子串长度。\n\n方法一：栈存下标（推荐）\n栈底始终保存「最后一个未匹配位置」：\n1. 栈初始压入 -1（基准）\n2. 遇 \'(\'：下标入栈\n3. 遇 \')\'：先弹栈顶——若栈空说明这个 \')\' 多余，把当前下标入栈（新的基准）；若栈非空，当前有效长度 = i - 栈顶（新的栈顶即最近未匹配位置），更新答案\n\n核心代码：\n  int longestValidParentheses(string s) {\n      stack<int> st; st.push(-1);          // 基准下标\n      int ans = 0;\n      for (int i = 0; i < s.size(); i++) {\n          if (s[i] == \'(\') st.push(i);\n          else {\n              st.pop();\n              if (st.empty()) st.push(i);  // 断点成为新基准\n              else ans = max(ans, i - st.top());\n          }\n      }\n      return ans;\n  }\n\n方法二：DP\ndp[i] = 以 i 结尾的最长有效括号长度（必是 \')\' 结尾）：\n- s[i-1]==\'(\' 且 s[i]==\')\'：dp[i] = dp[i-2] + 2\n- s[i-1]==\')\' 且 s[i]==\')\' 且 s[i - dp[i-1] - 1]==\'(\'：dp[i] = dp[i-1] + 2 + dp[i - dp[i-1] - 2]\n（后者是把嵌套段和前面的独立段拼接起来）\n\n方法三：双向扫描（O(1) 空间）\n从左到右数 left/right，left==right 时记录长度，left>right 且 right==0 时清零重数；再从右到左对称扫一遍取最大。\n\n时间复杂度均 O(n)，空间：栈/DP 为 O(n)，双向扫描 O(1)。',
    keyDifficulties: '1. 栈里存「下标」且初始压 -1：弹栈后用 i - st.top() 直接得长度，栈空时当前下标成为新基准\n2. \')\' 弹栈后栈空与否是分叉点：非空才算有效段，空则本位置是「断点」\n3. DP 法第二种转移要拼三段：内层 dp[i-1] + 配对的 \'(\' 与 \')\' 的 2 + 更前面的 dp[i-dp[i-1]-2]\n4. 双向扫描必须两个方向都扫：单向无法覆盖 \'(()\' 这类右缺失的情况（\'((\' 左缺失同理）',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 95, number: 23, title: '合并 K 个升序链表', titleEn: 'Merge k Sorted Lists', difficulty: '困难',
    knowledge: ['堆', '分治', '链表', '归并排序'],
    solution: '合并 k 个有序链表。\n\n方法一：小顶堆（推荐）\n1. k 个链表的头节点入小顶堆（priority_queue 自定义比较器，按节点值小顶）\n2. 弹出堆顶（当前最小）接到结果尾部，其后继节点若非空则入堆\n3. 堆空即合并完成\n哑节点统一头部处理。\n\n核心代码：\n  ListNode* mergeKLists(vector<ListNode*>& lists) {\n      auto cmp = [](ListNode* a, ListNode* b) { return a->val > b->val; };\n      priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> pq(cmp);\n      for (auto h : lists) if (h) pq.push(h);\n      ListNode dummy, *t = &dummy;\n      while (!pq.empty()) {\n          ListNode* node = pq.top(); pq.pop();\n          t->next = node; t = node;\n          if (node->next) pq.push(node->next);   // 后继入堆\n      }\n      return dummy.next;\n  }\n\n方法二：分治两两合并（推荐）\nmergeK(lists, l, r)：把 [l, r] 从中间切开，两边各自递归合并后再把两条链合并（21 题逻辑）。\nk 条链分治只需 log k 轮，每轮总代价 O(n)，总 O(n log k)，且无堆的常数。\n\n方法三：顺序合并\n拿一条结果链依次与下一条合并，第 i 次代价 O(i × len)，总 O(nk)，大数据会超时。\n\n时间复杂度：堆/分治 O(n log k)；空间：堆 O(k)，分治 O(log k) 递归栈。',
    keyDifficulties: '1. 堆的比较器重载 operator()(ListNode* a, ListNode* b) { return a->val > b->val; }（小顶堆方向易写反）\n2. 弹出节点后要把 node->next 入堆，而不是先入全部节点（否则堆 O(n) 空间且浪费）\n3. 分治的终止：l==r 返回该链，l>r 返回空；中间点 mid = (l+r)/2 时递归 [l,mid] 与 [mid+1,r]\n4. 三个方法的差距在 k 大时明显：顺序合并 O(nk) 与分治 O(n log k) 是本质差别',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 96, number: 10, title: '正则表达式匹配', titleEn: 'Regular Expression Matching', difficulty: '困难',
    knowledge: ['动态规划', '字符串匹配'],
    solution: ' \'.\' 匹配任意单字符，\'*\' 匹配前一个字符零次或多次，实现支持这两者的匹配。\n\n方法一：二维 DP（推荐）\nf[i][j] 表示 s 前 i 个字符与 p 前 j 个字符是否匹配：\n1. p[j-1] 是普通字符或 \'.\'：f[i][j] = f[i-1][j-1] && (p[j-1]==\'.\' || p[j-1]==s[i-1])\n2. p[j-1] == \'*\'（配 p[j-2]）：\n   - 匹配零次：f[i][j] = f[i][j-2]（把 x* 整体丢弃）\n   - 匹配至少一次：s[i-1] 能被 x 描述（x==\'.\' 或 x==s[i-1]）时 f[i][j] |= f[i-1][j]\n     （消费一个 s 字符，x* 继续留着）\n3. 边界：f[0][0]=true；f[0][j] 仅当 p 前缀可整体消解为空（形如 a*b*c*）时为 true\n\n初始后按 i 从 0、j 从 1 双循环填表。\n\n核心代码：\n  bool isMatch(string s, string p) {\n      int m = s.size(), n = p.size();\n      vector<vector<bool>> f(m + 1, vector<bool>(n + 1, false));\n      f[0][0] = true;\n      for (int j = 2; j <= n; j += 2)\n          if (p[j-1] == \'*\') f[0][j] = f[0][j-2];   // a*b* 类可匹配空串\n      for (int i = 0; i <= m; i++)\n          for (int j = 1; j <= n; j++) {\n              if (p[j-1] == \'*\') {\n                  f[i][j] = f[i][j-2];                              // x* 用零次\n                  if (i > 0 && (p[j-2] == \'.\' || p[j-2] == s[i-1]))\n                      f[i][j] = f[i][j] || f[i-1][j];               // x* 再吃一个\n              } else if (i > 0 && (p[j-1] == \'.\' || p[j-1] == s[i-1]))\n                  f[i][j] = f[i-1][j-1];\n          }\n      return f[m][n];\n  }\n\n方法二：递归 + 记忆化\nmatch(i, j) 同上定义，处理 \'*\' 时「跳过 / 吃一个」两个分支取或。逻辑相同，方向相反。\n\n时间复杂度 O(mn)，空间 O(mn)。',
    keyDifficulties: '1. \'*\' 不能单独存在，必须与其前一字符绑定成 x* 整体考虑——j 的转移常以 j-2 为基准\n2. 「匹配零次」是 f[i][j-2] 不是 f[i][j-1]：丢掉的是 x* 两个字符\n3. 「匹配多次」是 f[i-1][j]（x* 原地保留），不是 f[i-1][j-1]——这是与普通双串 DP 最易混处\n4. f[0][j] 的初始化不能全 false：a*b* 类模式能匹配空串',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 97, number: 4, title: '寻找两个正序数组的中位数', titleEn: 'Median of Two Sorted Arrays', difficulty: '困难',
    knowledge: ['二分查找', '分治'],
    solution: '两个有序数组找中位数，要求 O(log(m+n))。\n\n思路转化：中位数（或两中位数平均）= 第 k 小问题。设 total = m+n，找第 k = (total+1)/2 与 (total+2)/2 小的两个数取平均。\n\n方法一：二分第 k 小（推荐）\ngetKth(k) 在两个数组中找第 k 小：\n1. 比较 a[i + k/2 - 1] 与 b[j + k/2 - 1]（各自第 k/2 个候选）\n2. 较小的一方可安全排除前 k/2 个（它们整体排名必然 < k）\n3. 排除方起点后移、k 减去排除数量，递归；k==1 取两起点较小者；一方耗尽取另一方第 k 个\n\n核心代码：\n  double findMedianSortedArrays(vector<int>& a, vector<int>& b) {\n      int total = a.size() + b.size();\n      if (total % 2) return getKth(a, 0, b, 0, total / 2 + 1);\n      return (getKth(a, 0, b, 0, total / 2) + getKth(a, 0, b, 0, total / 2 + 1)) / 2.0;\n  }\n  int getKth(vector<int>& a, int i, vector<int>& b, int j, int k) {\n      if (i >= a.size()) return b[j + k - 1];\n      if (j >= b.size()) return a[i + k - 1];\n      if (k == 1) return min(a[i], b[j]);\n      int x = i + k/2 - 1 < a.size() ? a[i + k/2 - 1] : INT_MAX;\n      int y = j + k/2 - 1 < b.size() ? b[j + k/2 - 1] : INT_MAX;\n      if (x < y) return getKth(a, i + k/2, b, j, k - k/2);  // 排除 a 的前 k/2\n      else       return getKth(a, i, b, j + k/2, k - k/2);  // 排除 b 的前 k/2\n  }\n\n方法二：二分较短数组的分割线（等价、同样经典）\n在较短的 A 中二分分割位置 i，B 的分割 j = (m+n+1)/2 - i，使 A[i-1] <= B[j] 且 B[j-1] <= A[i]。\n分割线左侧最大与右侧最小按奇偶取值。每次二分排除一半，O(log min(m,n))。\n\n方法三（不满足题意）：合并后取中位数，O(m+n)。\n\n时间复杂度 O(log(m+n))，空间 O(1)。',
    keyDifficulties: '1. 二分的是「排除多少个」而不是具体答案位置：每次砍掉 k/2 个必然不可能是第 k 小的元素\n2. 候选越界时取数组末尾（INT_MAX 无关紧要），排除量按「实际存在的个数」算\n3. 分割线法的约束是「左半最大 <= 右半最小」，且保证在较短数组上二分（否则 j 可能越界）\n4. 奇偶长度统一技巧：第 (total+1)/2 与 (total+2)/2 小的两个数求平均，奇数时两值相同',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 98, number: 85, title: '最大矩形', titleEn: 'Maximal Rectangle', difficulty: '困难',
    knowledge: ['单调栈', '动态规划', '矩阵操作'],
    solution: '01 矩阵中只包含 1 的最大矩形面积。\n\n方法一：逐行柱状图 + 单调栈（推荐，复用 84 题）\n1. 逐行累积高度：heights[j] = 当前列自本行起连续 1 的个数（遇 0 清零，遇 1 加一）\n2. 每行把 heights 当作柱状图，用 84 题的单调栈求「柱状图中最大矩形」\n3. 答案取所有行的最大值\n\n例：矩阵第 i 行 1110，第 i-1 行 1111 → 第 i 行 heights = [2,2,2,0]，即把上方连续 1 压成柱子。\n\n核心代码：\n  int maximalRectangle(vector<vector<char>>& matrix) {\n      if (matrix.empty()) return 0;\n      int m = matrix.size(), n = matrix[0].size(), ans = 0;\n      vector<int> h(n, 0);\n      for (int i = 0; i < m; i++) {\n          for (int j = 0; j < n; j++)\n              h[j] = matrix[i][j] == \'1\' ? h[j] + 1 : 0;  // 逐行压成柱状图\n          ans = max(ans, largestRectangleArea(h));        // 复用 84 题\n      }\n      return ans;\n  }\n  int largestRectangleArea(vector<int>& h) {\n      h.push_back(0);                        // 哨兵强制清栈\n      stack<int> st; int ans = 0;\n      for (int i = 0; i < h.size(); i++) {\n          while (!st.empty() && h[st.top()] > h[i]) {\n              int height = h[st.top()]; st.pop();\n              int l = st.empty() ? -1 : st.top();\n              ans = max(ans, height * (i - l - 1));\n          }\n          st.push(i);\n      }\n      h.pop_back();\n      return ans;\n  }\n\n方法二：DP（左右边界收缩）\n对每行每列维护 height、left、right 三个数组：\n- height[j]：连续 1 高度\n- left[j] / right[j]：以该高度可延伸的最左/右边界\n转移在逐行更新时收缩边界，面积 = height × (right - left)。O(nm) 但边界转移难写对。\n\n时间复杂度 O(nm)（每行单调栈均摊 O(m)），空间 O(m)。',
    keyDifficulties: '1. 「逐行压扁成柱状图」是把二维问题降到 84 题的桥梁：heights 遇 0 归零、遇 1 累加\n2. 每行单调栈前后要压哨兵（两侧加 0）清空栈内残留，否则边界列会漏算\n3. 方法二的 left/right 收缩条件（0 处重置、非 0 处取 max/min）是 DP 版唯一难点，逻辑不如单调栈直观\n4. 与 221 最大正方形对比：正方形取 min(左,上,左上)+1；矩形必须借助「最大高度 × 宽度」的柱状图模型',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 99, number: 84, title: '柱状图中最大的矩形', titleEn: 'Largest Rectangle in Histogram', difficulty: '困难',
    knowledge: ['单调栈', 'stack'],
    solution: '柱状图中能勾勒出的最大矩形面积。\n\n核心观察：最大矩形一定「以某根柱子为高度、向两侧扩展到第一根比它矮的柱子为止」。\n即对每根柱 i，找左边第一个更矮的位置 left[i] 和右边第一个更矮的位置 right[i]，面积 = h[i] × (right[i] - left[i] - 1)。\n\n方法一：单调栈（推荐）\n维护高度递增的栈（存下标）：\n1. 遍历到 h[i] < h[栈顶] 时，栈顶柱子遇到「右边第一个更矮的」，弹出结算：\n   高 h[top]，宽 = i - 新栈顶 - 1\n2. 相等高度可弹可不弹（答案不受影响）\n3. 首尾加高度 0 的哨兵，强制清算所有柱子，免去收尾循环\n\n核心代码：\n  int largestRectangleArea(vector<int>& heights) {\n      heights.insert(heights.begin(), 0);  // 首尾哨兵，免收尾清栈\n      heights.push_back(0);\n      stack<int> st;                       // 存下标，高度递增\n      int ans = 0;\n      for (int i = 0; i < heights.size(); i++) {\n          while (!st.empty() && heights[st.top()] > heights[i]) {\n              int h = heights[st.top()]; st.pop();\n              ans = max(ans, h * (i - st.top() - 1));  // 右边界 i，左边界新栈顶\n          }\n          st.push(i);\n      }\n      return ans;\n  }\n\n方法二：两次单调栈预处理\n分别求 left[]/right[] 数组再统一结算，逻辑等价、稍多一次遍历。\n\n时间复杂度 O(n)（均摊），空间 O(n)。',
    keyDifficulties: '1. 结算时机是「当前柱比栈顶矮」：当前柱 i 就是栈顶柱的右边界，新栈顶是左边界\n2. 哨兵（前后补 0）能自动清栈，是最不容易漏结算的写法；不补哨兵则要单独处理剩余栈\n3. 宽度计算是 i - st.top() - 1（弹掉栈顶后），弹出后栈空时宽度为 i（左边没有更矮的）\n4. 与接雨水的单调栈方向相反：接雨水维护递减栈（找更高的挡板），本题维护递增栈（找更矮的边界）',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 100, number: 76, title: '最小覆盖子串', titleEn: 'Minimum Window Substring', difficulty: '困难',
    knowledge: ['滑动窗口', '哈希表', '双指针'],
    solution: '求 s 中覆盖 t 全部字符（含次数）的最短子串。\n\n方法一：滑动窗口 + 欠账计数（推荐）\n用 need[c]（t 中字符还差几个）、count（总欠账）替代整表比较：\n1. 统计 t 建立 need 与 count\n2. 右指针扩张：纳入字符 c 时若 need[c] > 0 说明还债了，count--；need[c]--（多余的记为负）\n3. count == 0 时窗口已覆盖：左指针收缩——移出字符 c 时 need[c]++，若 need[c] > 0 说明破坏了覆盖（count++），收缩前记录最短窗口\n4. 重复直到右指针到头\n\n收缩发生在覆盖成立之后，扩张发生在失覆盖时——窗口始终单向移动，均摊 O(|s| + |t|)。\n\n核心代码：\n  string minWindow(string s, string t) {\n      vector<int> need(128, 0);\n      for (char c : t) need[c]++;\n      int cnt = t.size(), minLen = INT_MAX, start = 0;\n      for (int l = 0, r = 0; r < s.size(); r++) {\n          if (need[s[r]] > 0) cnt--;       // 有效还债\n          need[s[r]]--;\n          while (cnt == 0) {               // 已覆盖：收缩左端\n              if (r - l + 1 < minLen) { minLen = r - l + 1; start = l; }\n              if (++need[s[l]] > 0) cnt++; // 移出后破坏覆盖\n              l++;\n          }\n      }\n      return minLen == INT_MAX ? "" : s.substr(start, minLen);\n  }\n\n方法二：过滤后滑动窗口\n先把 s 中属于 t 的字符（保留下标）抽成短数组再滑窗，字符集稀疏时显著加速。\n\n时间复杂度 O(|s| + |t|)，空间 O(字符集)。',
    keyDifficulties: '1. 「欠账计数」把 O(128) 的表比较降到 O(1)：need[c]>0 才是有效还债，负值表示冗余\n2. 左指针收缩的前提是 count==0（已覆盖），收缩到刚好破坏为止，这一步记录最短\n3. 移出字符时先自增再判断：need[c] > 0 才意味着覆盖被破坏，冗余字符移出不影响\n4. 答案记录「最短的窗口」而非所有窗口；无覆盖返回空串，注意长度比较用 <= 保持最先出现的',
    createdAt: '2026-09-02T10:00:00'
  },
];

const DEFAULT_KNOWLEDGE = [
  {
    id: 1, name: 'vector', category: 'STL 容器',
    summary: '动态数组，连续内存存储，支持随机访问',
    content: 'vector 是 C++ STL 中最常用的容器之一，封装了动态数组。它在堆上分配连续的内存空间，因此支持 O(1) 的随机访问（通过下标或 at()）。\n\n当元素数量超过当前容量时，vector 会重新分配一块更大的内存（通常是当前容量的 1.5~2 倍），将所有元素移动到新内存，然后释放旧内存。这种策略保证了尾部插入的均摊时间复杂度为 O(1)。\n\n相比普通数组，vector 的优势在于自动管理内存、支持动态扩容、提供丰富的成员方法。代价是有一定的空间开销（多余的容量）。',
    methods: 'push_back() | 在尾部添加一个元素 | 均摊 O(1)\npop_back() | 移除尾部元素 | O(1)\nsize() | 返回当前元素个数 | O(1)\ncapacity() | 返回当前容量 | O(1)\nempty() | 判断是否为空 | O(1)\nclear() | 清空所有元素 | O(n)\noperator[] | 随机访问（不检查越界） | O(1)\nat() | 随机访问（越界抛异常） | O(1)\nbegin() / end() | 返回首/尾迭代器 | O(1)\ninsert() | 在指定位置插入元素 | O(n)\nerase() | 删除指定位置元素 | O(n)\nreserve() | 预分配容量 | O(n)\nresize() | 改变元素个数 | O(n)',
    tips: '1. 如果预先知道元素数量，使用 reserve() 预分配容量，避免多次扩容导致性能损失\n2. 遍历时优先使用下标或范围 for 循环，迭代器在修改元素时需要注意失效问题\n3. 频繁在中间插入/删除时考虑 list 或 deque，vector 适合尾部操作\n4. 二维 vector 常用于表示矩阵或图，注意内存连续性带来的性能优势\n5. vector<bool> 是特化版本，用位存储，operator[] 返回的是代理对象，不推荐使用',
    createdAt: '2026-07-29T10:00:00'
  },
  {
    id: 2, name: 'unordered_map', category: 'STL 容器',
    summary: '哈希表实现的键值对容器，平均 O(1) 查找',
    content: 'unordered_map 是 C++ STL 中的哈希表容器，以键值对（key-value）形式存储数据。它使用哈希函数将 key 映射到桶（bucket），从而实现平均 O(1) 的查找、插入和删除操作。\n\n在 C++11 及以后的标准中可用。与 map（红黑树实现，O(log n) 操作）不同，unordered_map 的元素是无序的，但效率更高。\n\n当哈希冲突过多时（装载因子过大），容器会自动 rehash 以扩大桶的数量，保证操作效率。',
    methods: 'insert() | 插入键值对 | 平均 O(1)\nerase() | 删除指定 key 或迭代器 | 平均 O(1)\nfind() | 查找 key，返回迭代器 | 平均 O(1)\ncount() | 返回 key 出现次数（0 或 1） | 平均 O(1)\noperator[] | 访问或插入（key 不存在时默认构造） | 平均 O(1)\nat() | 访问，key 不存在时抛异常 | 平均 O(1)\nsize() | 返回元素个数 | O(1)\nempty() | 判断是否为空 | O(1)\nclear() | 清空所有元素 | O(n)\nbegin() / end() | 返回首/尾迭代器 | O(1)',
    tips: '1. find() 比 count() + operator[] 更高效，因为 operator[] 在 key 不存在时会插入默认值\n2. 自定义类型作为 key 时需要提供哈希函数和相等比较函数\n3. 刷题时常用于：两数之和、频率统计、缓存/记忆化搜索、去重\n4. 如果 key 是有序的且不需要哈希表的 O(1) 性能，可以考虑 map（红黑树）\n5. 注意哈希表遍历是无序的，如果需要有序输出需要额外排序',
    createdAt: '2026-07-29T10:00:00'
  },
  {
    id: 3, name: '哈希表', category: '数据结构',
    summary: '基于哈希函数实现的高效查找数据结构',
    content: '哈希表（Hash Table）是一种通过哈希函数将 key 映射到存储位置的数据结构。它支持接近 O(1) 的插入、删除和查找操作。\n\n核心思想是利用哈希函数 f(key) = index 将 key 转为数组下标，从而实现直接寻址。不同的 key 可能映射到相同的位置，称为哈希冲突。解决冲突的常见方法有：链地址法（拉链法）、开放地址法（线性探测、二次探测）等。\n\n在 C++ 中，unordered_set 和 unordered_map 是哈希表的典型实现。',
    methods: '',
    tips: '1. 哈希表是「空间换时间」的典型例子\n2. 选择合适的哈希函数可以减少冲突，提高效率\n3. 哈希表通常不支持范围查询（如查找所有大于某个值的元素）\n4. 设计哈希表时需要考虑装载因子，通常保持在 0.75 以下\n5. 在算法题中，哈希表常用于：O(n) 时间解决两数之和、判断环、缓存结果等',
    createdAt: '2026-07-29T10:00:00'
  },
  {
    id: 4, name: 'stack', category: 'STL 容器',
    summary: '栈，后进先出（LIFO）的容器适配器',
    content: 'stack 是 C++ STL 中的容器适配器，它基于底层容器（默认是 deque）封装了后进先出（LIFO, Last In First Out）的操作接口。\n\n栈是一种受限的线性表，只允许在栈顶进行插入（push）和删除（pop）操作。这种限制使得栈特别适合处理具有「嵌套」或「回溯」性质的问题。\n\n刷题中 stack 的经典应用场景：\n- 括号匹配（如本题）\n- 表达式求值（中缀转后缀、计算器）\n- 深度优先搜索（DFS）的非递归实现\n- 单调栈（下一个更大元素、接雨水等）\n- 浏览器的前进/后退功能',
    methods: 'push() | 在栈顶插入元素 | O(1)\npop() | 移除栈顶元素 | O(1)\ntop() | 访问栈顶元素 | O(1)\nempty() | 判断栈是否为空 | O(1)\nsize() | 返回栈中元素个数 | O(1)',
    tips: '1. 使用 stack 前需 #include <stack>\n2. 调用 top() 或 pop() 前，务必用 empty() 检查栈是否为空，否则空栈操作会导致程序崩溃\n3. 括号匹配问题是 stack 最经典的应用，记住「左括号入栈，右括号出栈匹配」的口诀\n4. 单调栈是进阶用法，用于在 O(n) 时间内求解「下一个更大/更小元素」\n5. stack 没有 clear() 方法，清空需循环 pop() 或直接重新赋值空栈\n6. 底层容器可选 deque（默认）、vector 或 list，通常不需要修改',
    createdAt: '2026-07-29T12:00:00'
  },
  {
    id: 5, name: '链表', category: '数据结构',
    summary: '由节点组成的线性数据结构，每个节点包含数据和指向下一个节点的指针',
    content: '链表（Linked List）是一种线性数据结构，由一系列节点组成。每个节点包含两部分：存储数据的值（val）和指向下一个节点的指针（next）。\n\n与数组相比，链表的主要特点：\n- 插入/删除操作高效（O(1)），只需修改指针\n- 不支持随机访问，查找需 O(n) 遍历\n- 不需要连续内存空间\n- 长度可以动态变化\n\n常见链表类型：\n- 单向链表：每个节点只有 next 指针\n- 双向链表：节点有 prev 和 next 指针\n- 循环链表：尾节点的 next 指向头节点',
    methods: 'ListNode(val) | 创建值为 val 的新节点 | O(1)\nnode->next | 访问/修改下一个节点 | O(1)\nnode->val | 访问/修改节点值 | O(1)\ndummy->next | 通过哑节点获取链表头 | O(1)',
    tips: '1. 链表题的核心是画图！推荐在纸上画出节点和指针关系再编码\n2. 操作链表时，先处理「被断开的节点」的指针，再修改「主动操作」的指针\n3. 涉及头节点可能被修改的场景，优先使用哑节点（dummy node）简化逻辑\n4. C++ 中链表节点通常在堆上创建（new），注意内存释放\n5. 快慢指针是链表题的常用技巧（找中点、判断环）',
    createdAt: '2026-07-30T10:00:00'
  },
  {
    id: 6, name: '递归', category: '算法思想',
    summary: '函数调用自身的编程方式，将大问题分解为相同结构的子问题',
    content: '递归（Recursion）是一种通过函数调用自身来解决问题的方法。核心思想是将原问题分解为一个或多个相同结构的子问题，直到子问题简单到可以直接求解（递归基/终止条件）。\n\n递归包含两个关键要素：\n1. 递归关系（递推公式）：将大问题分解为子问题的规则\n2. 终止条件（递归基）：不再递归的条件，直接返回结果\n\n递归的调用过程涉及函数调用栈，每次递归调用都会在栈上分配空间。因此递归深度过大可能导致栈溢出。\n\n优点：代码简洁、逻辑清晰，特别适合树/图遍历、分治算法。\n缺点：可能有重复计算（可用记忆化优化）、空间复杂度较高。',
    methods: '',
    tips: '1. 写递归时先确定终止条件，再写递归逻辑\n2. 理解递归的「递」（向下调用）和「归」（向上返回）两个阶段\n3. 链表天然具有递归结构（一个节点 + 剩余链表），很多链表题可递归求解\n4. 递归 vs 迭代的选择：递归更简洁但空间 O(n)，迭代更高效但代码略复杂\n5. 防止栈溢出：递归深度超过 ~10^4 层时考虑用迭代替代',
    createdAt: '2026-07-30T10:00:00'
  },
  {
    id: 7, name: '迭代', category: '算法思想',
    summary: '通过循环重复执行一段代码来逐步逼近结果的过程',
    content: '迭代（Iteration）是一种通过循环结构（for、while 等）反复执行一段代码来解决问题的编程方法。与递归不同，迭代不涉及函数自调用，而是通过变量更新来逐步推进计算。\n\n迭代的优点是空间效率高（通常 O(1) 或 O(n) 显式空间），没有递归调用的栈开销。但某些问题（如树遍历）用迭代实现时可能需要手动维护栈或队列，代码不如递归直观。\n\n刷题中需要根据场景选择：\n- 递归适合：树/图遍历、分治问题、回溯\n- 迭代适合：线性遍历、动态规划、需要高效率的场景',
    methods: '',
    tips: '1. 迭代通常用 while 或 for 循环实现，注意循环不变量的维护\n2. 链表题的迭代法通常配合「指针移动」：prev、curr、next 三个指针的协作\n3. 迭代可以替代递归，但有时需要手动维护栈（如二叉树的中序遍历）\n4. 迭代法的空间复杂度通常优于递归，但代码可读性可能稍差\n5. 在合并有序链表这类题中，迭代法比递归更省空间，也更推荐',
    createdAt: '2026-07-30T10:00:00'
  },
  {
    id: 8, name: '哑节点', category: '技巧',
    summary: '在链表头部前附加一个辅助节点，用于简化头节点处理',
    content: '哑节点（Dummy Node）是链表操作中一种常用的技巧。它在真正的头节点之前创建一个额外的辅助节点，这个节点本身不存储实际数据（或数据无意义），其 next 指针指向链表的第一个实际节点。\n\n在 C++ 中，哑节点通常创建在栈上：ListNode dummy(0); ListNode* tail = &dummy;\n\n返回时直接取 dummy.next 即可获得处理后的链表头。\n\n使用哑节点的好处：\n- 统一处理头节点的插入/删除，无需针对头节点写特殊逻辑\n- 当链表可能为空时尤其方便，tail->next 始终有效\n- 确保函数返回时一定有有效的头节点（dummy.next 可能为 nullptr）',
    methods: '',
    tips: '1. 哑节点是「空间换代码简洁」的典型，不增加时间复杂度，仅 O(1) 额外空间\n2. 哑节点在栈上创建即可，返回 dummy.next，栈上 dummy 对象的生命周期不影响返回的指针\n3. 使用哑节点后，tail->next 始终可以安全访问，无需判空\n4. 常见应用：合并有序链表、链表反转、删除节点、链表分区\n5. 记得最后返回 dummy.next，而不是 dummy',
    createdAt: '2026-07-30T10:00:00'
  },
  {
    id: 9, name: '动态规划', category: '算法思想',
    summary: '将问题分解为重叠子问题，通过存储子问题结果避免重复计算',
    content: '动态规划（Dynamic Programming，简称 DP）是一种通过将原问题分解为相互重叠的子问题，并存储子问题的解来避免重复计算的算法设计方法。\n\n—— 适用条件（用大白话讲）——\n\n三个条件缺一不可，但对新手来说最关键是前两个：\n\n1. 最优子结构：大问题的最优解 = 由子问题的最优解拼出来。\n   - 例：爬楼梯到第 n 阶 = 从第 n-1 阶上 1 步 + 从第 n-2 阶上 2 步，所以 dp[n] = dp[n-1] + dp[n-2]\n   - 翻译：能不能把「答案」拆成「小一点的问题的答案」？能拆 → 有机会用 DP。\n\n2. 重叠子问题：递归求解时会反复算同一个子问题。\n   - 例：算斐波那契 f(5) 要算 f(4)、f(3)，而 f(4) 又要算 f(3)、f(2)——f(3) 被重复算了\n   - 翻译：暴力递归有没有在「重复做无用功」？有 → 用 DP 存起来省时间。\n\n3. 无后效性：某个状态定下来后，它不会因为后面的选择而改变。\n   - 例：到达格子 (i,j) 的路径数只取决于到达它的上/左格子，和「之后怎么走」无关\n   - 翻译：子问题算完就是定值，不依赖「将来的决策」。\n\n—— 看到这些特征 → 优先想 DP ——\n\n题目问的是：\n- 求「方案数」（有多少种走法/组合/方法）→ 典型 DP（如 62 不同路径、70 爬楼梯）\n- 求「最大/最小」且能拆成子问题 → DP 或贪心（如 300 最长递增子序列、64 最小路径和）\n- 求「是否可行/是否存在」且能递推 → DP（如 55 跳跃游戏，但贪心更优）\n- 输入是一个序列/网格，答案依赖「前面或子区间的结果」\n- 数据规模提示：n 在 100~1000 级别 → O(n²) 的 DP 可行\n\n—— 一个简单的判断套路 ——\n\n第 1 步：先写暴力递归（把问题用递归表达）\n第 2 步：观察递归树有没有重复节点（重叠子问题）\n  - 没有重复 → 可能是分治/递归，不需要 DP\n  - 有重复 → 进入第 3 步\n第 3 步：给递归加记忆化（memo 数组）—— 这就是「自顶向下 DP」\n第 4 步：把递归改成迭代填表（dp 数组）—— 就是标准的「自底向上 DP」\n第 5 步：观察转移只依赖前几项 → 用滚动数组压缩空间\n\n—— 什么情况不适合 DP ——\n\n- 子问题相互独立（没有重叠）→ 用分治（如归并排序）\n- 局部最优能推出全局最优 → 用贪心（更简单更快，如 55 题、121 题）\n- 需要穷举所有方案本身（不只是数量）→ 用回溯（如 46 全排列、39 组合总和）\n- 图的最短路径 → Dijkstra/BFS，不是经典 DP（除非是 DAG）\n\n—— 实现方式 ——\n- 自顶向下（递归 + 记忆化）：思路直观，先写递归再加 memo，不容易漏状态\n- 自底向上（迭代填表）：用循环按顺序填 dp 表，空间更好控制，通常是最终版本',
    methods: '',
    tips: '1. 刷 DP 的通用步骤：暴力递归 → 加 memoization → 改迭代填表 → 优化空间\n2. 状态定义是灵魂：dp[i] / dp[i][j] 到底代表什么？定义对了转移方程自然就出来了\n3. 写转移方程问自己：当前状态能从哪些「更小的状态」推过来？\n4. 别忘了初始条件和边界：dp[0] 或 dp[0][*] 是多少？数组越界要单独处理\n5. 判断信号：「方案数」「最大/最小」「重叠子问题」→ 想 DP\n6. 经典 DP 类型：背包DP、区间DP、树形DP、数位DP、状态压缩DP；网格路径、LCS、编辑距离',
    createdAt: '2026-07-30T12:00:00'
  },
  {
    id: 10, name: '滚动数组', category: '技巧',
    summary: '用固定数量的变量滚动更新，将 DP 空间从 O(n) 优化到 O(1)',
    content: '滚动数组（Rolling Array / Space Optimization）是一种 DP 空间优化技巧。当状态转移方程只依赖前 k 个状态时，无需存储整个 DP 表，只需用 k 个变量滚动记录即可。\n\n以爬楼梯为例，dp[i] 只依赖 dp[i-1] 和 dp[i-2]，所以只需要两个变量：\nint a = 1, b = 2;  // dp[1], dp[2]\nfor (int i = 3; i <= n; i++) {\n    int c = a + b;  // dp[i] = dp[i-1] + dp[i-2]\n    a = b;           // 滚动：a 变成之前的 dp[i-1]\n    b = c;           // 滚动：b 变成当前的 dp[i]\n}\n\n本质上是「用时间换空间」的反面——不牺牲时间，只节省空间。',
    methods: '',
    tips: '1. 适用场景：dp[i] 只依赖前 k 个状态，通常 k 很小（1 或 2）\n2. 二维 DP 也可用滚动数组：如 dp[i][j] 只依赖 dp[i-1][...]，则只需两行\n3. 注意滚动时变量的更新顺序，确保用的是上一轮的值而非本轮刚更新的值\n4. 滚动数组只优化空间，不影响时间复杂度\n5. 在面试中，先写出完整 DP 表再优化空间比直接写最优解更稳妥',
    createdAt: '2026-07-30T12:00:00'
  },
  {
    id: 11, name: '二叉树', category: '数据结构',
    summary: '每个节点最多有两个子节点（左/右）的树形结构',
    content: '二叉树（Binary Tree）是一种树形数据结构，每个节点最多有两个子节点，分别称为左子节点（left）和右子节点（right）。\n\n二叉树的递归定义：二叉树要么为空，要么由根节点 + 左子树 + 右子树组成。这种递归性质使得很多二叉树问题可以自然地用递归求解。\n\n常见类型：\n- 满二叉树：每层节点数都达到最大值\n- 完全二叉树：除最后一层外全满，最后一层从左到右填充\n- 二叉搜索树（BST）：左子树所有节点 < 根 < 右子树所有节点\n- 平衡二叉树（如 AVL）：左右子树高度差不超过 1\n\n常见遍历方式：\n- 前序：根 → 左 → 右\n- 中序：左 → 根 → 右（BST 的中序是升序序列）\n- 后序：左 → 右 → 根\n- 层序：逐层从左到右（BFS）',
    methods: 'TreeNode(val) | 创建值为 val 的树节点 | O(1)\nnode->left | 访问左子节点 | O(1)\nnode->right | 访问右子节点 | O(1)\nnode->val | 访问节点值 | O(1)',
    tips: '1. 二叉树题 90% 可以用递归解决——先处理当前节点，再递归处理左右子树\n2. 递归函数的三步法：①终止条件 ②递归处理左右子树 ③合并结果\n3. 迭代遍历需要手动维护栈（前/中/后序）或队列（层序）\n4. 很多树题的核心是「遍历」+「在遍历过程中做额外操作」\n5. 二叉树常考题型：遍历、最大深度、路径问题、构建树、序列化\n6. C++ 中树节点通常在堆上创建（new TreeNode(val)），注意内存释放',
    createdAt: '2026-07-30T14:00:00'
  },
  {
    id: 12, name: '广度优先搜索', category: '算法思想',
    summary: 'BFS，逐层向外扩展的搜索策略，配合队列实现',
    content: '广度优先搜索（Breadth-First Search，BFS）是一种逐层向外扩展的搜索算法。从起点出发，先访问所有「距离为 1」的节点，再访问「距离为 2」的节点，以此类推。\n\nBFS 的核心是队列（FIFO）：\n- 初始将起点入队\n- 每次从队首取出一个节点，将其未访问的邻居入队\n- 重复直到队列为空\n\nBFS 的特点：\n- 第一次到达某个节点时的路径一定是最短路径（无权图）\n- 天然逐层遍历，适合计算「层数/深度」\n- 时间复杂度 O(V+E)，空间复杂度 O(V)\n\n经典应用：\n- 二叉树的层序遍历\n- 图的最短路径（无权图）\n- 迷宫/网格最短步数\n- 拓扑排序的 Kahn 算法\n- 多源扩散问题（腐烂的橘子、感染）',
    methods: '',
    tips: '1. BFS 模板：queue + 循环，入队时标记 visited 防止重复访问\n2. 二叉树层序 BFS 关键：每轮用 sz = q.size() 固定当前层节点数，内层 for 处理一层\n3. 求最短步数时，每处理完一层 depth+1\n4. BFS vs DFS：BFS 找最短路径，DFS 找所有路径/回溯，BFS 空间大但不会爆栈\n5. 网格题中，上下左右四个方向用 dirs 数组枚举，注意边界检查',
    createdAt: '2026-07-30T16:00:00'
  },
  {
    id: 25, name: '深度优先搜索', category: '算法思想',
    summary: 'DFS，一路走到黑再回头的搜索策略，用栈/递归实现，适合穷举所有路径',
    content: '深度优先搜索（Depth-First Search，DFS）是一种沿着一条路径尽可能深地搜索，直到无法继续再回溯（回头）换一条路的搜索算法。\n\n实现方式：\n- 递归（最常见）：函数调用自身，天然利用调用栈\n- 显式栈：用 stack 模拟递归，避免递归爆栈\n\nDFS 的核心模式：\n  访问当前节点 → 递归处理所有邻居（未访问的）→ 回溯\n\nDFS 的特点：\n- 能穷举「所有可能的路径 / 所有方案」\n- 空间复杂度 O(深度)（通常优于 BFS 的 O(宽度)）\n- 不保证找到最短路径\n\n经典应用：\n- 二叉树的遍历（前/中/后序）\n- 网格搜索：单词搜索（79 题）、岛屿数量、迷宫\n- 回溯算法（全排列、组合、子集）本质就是 DFS\n- 图的连通性判断、拓扑排序\n\n与 BFS 的对比：\n- BFS 用队列、逐层扩展、找最短路径、空间 O(宽度)\n- DFS 用栈/递归、一路到底再回头、穷举所有方案、空间 O(深度)',
    methods: '',
    tips: '1. DFS 递归模板：边界检查 → 标记访问 → 递归邻居 → 回溯恢复（如需）\n2. 网格题四方向：用 dirs[4][2] 数组 + for 循环遍历，避免手写 4 次\n3. 求「所有方案」用 DFS + 回溯；求「最短路径」用 BFS\n4. 二叉树 DFS 就是递归遍历，先序/中序/后序的区别只在访问时机\n5. 递归深度过大（>10^4）时改用显式栈，防止栈溢出\n6. 需要「不重复走」时用 visited 标记或就地修改，回溯记得恢复',
    createdAt: '2026-08-02T12:00:00'
  },
  {
    id: 13, name: '贪心算法', category: '算法思想',
    summary: '每一步都做当前看起来最优的选择，期望最终结果全局最优',
    content: '贪心算法（Greedy Algorithm）是一种在每一步决策中都选择当前状态下的局部最优解，期望最终得到全局最优解的算法策略。\n\n贪心算法的关键前提：\n- 局部最优能推出全局最优（贪心选择性质）\n- 问题没有后效性：当前选择不影响后续选择\n\n贪心 vs 动态规划：\n- 贪心：每一步做局部最优，不能回退，不能保证所有问题都得到全局最优\n- 动态规划：考虑所有可能状态，通过状态转移保证全局最优，通常更通用\n- 能用贪心的题目通常也能用 DP 解，但贪心代码更简洁高效\n\n常见贪心场景：\n- 买卖股票（单次交易）：维护历史最低价\n- 活动安排/区间调度：按结束时间排序，选最早结束的\n- 找零钱（特定面额）\n- 跳跃游戏：每次跳到能到最远的位置\n- 分发饼干：满足尽可能多的孩子',
    methods: '',
    tips: '1. 贪心难在「证明」：写完要先论证局部最优 → 全局最优，再动手\n2. 做题套路：先排序（如果需要）→ 依次做局部最优决策\n3. 拿不准能否用贪心时，先用 DP 保底，或对拍验证\n4. 贪心的经典反例：0-1 背包问题（贪心可能选错），必须用 DP\n5. 很多贪心题的特征是「求最大/最小」+「每一步决策独立可证明最优」',
    createdAt: '2026-07-30T17:00:00'
  },
  {
    id: 14, name: '位运算', category: '技巧',
    summary: '直接操作二进制位的运算（& | ^ ~ << >>），常用来解决「成对出现」「去重」「计数」等问题',
    content: '位运算（Bit Manipulation）是直接对整数的二进制位进行操作的运算，运行速度极快，常用于空间换时间的巧妙解法。\n\n六大位运算符（C++）：\n1. 与 & ：两个位都为 1 时结果为 1\n   - x & 1 判断奇偶（最低位）\n   - x & (x-1) 去掉最低位的 1\n   - x & (-x) 取出最低位的 1（lowbit）\n2. 或 | ：两个位有一个为 1 结果为 1\n   - 用于「设置」某一位为 1\n   - 合并多个标志位\n3. 异或 ^ ：两个位不同为 1，相同为 0\n   - 核心性质：a^a=0，a^0=a，交换律、结合律\n   - 用于「消除成对元素」「找唯一」\n4. 取反 ~ ：0 变 1，1 变 0\n   - ~x = -(x+1)（补码表示）\n5. 左移 << ：x << k 等价于 x * 2^k\n6. 右移 >> ：x >> k 等价于 x / 2^k（向下取整）\n\n经典应用：\n- 只出现一次的数字：全部异或（本题）\n- 判断奇偶：x & 1\n- 判断 2 的幂：x > 0 && (x & (x-1)) == 0\n- 汉明距离 / 位 1 的个数：x & (x-1) 循环\n- 子集枚举：用 n 位二进制表示子集\n- 缺失的数字：下标与值全部异或',
    methods: 'a & b | 按位与 | O(1)\na | b | 按位或 | O(1)\na ^ b | 按位异或 | O(1)\n~a | 按位取反 | O(1)\na << k | 左移（乘以 2^k） | O(1)\na >> k | 右移（除以 2^k） | O(1)',
    tips: '1. 异或三件套背熟：a^a=0、a^0=a、交换律结合律——「消去成对、留下唯一」\n2. x & (x-1) 是高频技巧：消除最低位的 1，用于统计二进制 1 的个数\n3. x & (-x) 取出最低位的 1，用于树状数组 lowbit、求只出现一次的两个数字（按此分组）\n4. 位运算优先级低，写表达式时记得加括号（如 (x & 1) == 0）\n5. 左移/右移可代替乘以/除以 2 的幂，但注意移位有符号数时右移是算术右移\n6. 负数的位运算基于补码：~5 = -6，理解补码能避免坑',
    createdAt: '2026-07-30T18:00:00'
  },
  {
    id: 15, name: '快慢指针', category: '技巧',
    summary: '双指针以不同速度遍历，利用速度差来检测环、找中点、找倒数第 k 个节点',
    content: '快慢指针（Fast and Slow Pointers / Floyd 判圈算法）是一种双指针技巧，两个指针从同一位置出发，但以不同速度移动（通常慢指针每次 1 步，快指针每次 2 步）。\n\n核心原理：\n- 检测环：如果有环，快指针一定会在环内追上慢指针（相对速度 = 1 步/轮，距离递减）\n- 找中点：快指针到末尾时，慢指针正好在中间\n- 找倒数第 k 个：快指针先走 k 步，然后两指针同速走\n\n核心应用场景：\n1. 判断链表是否有环（环形链表）\n2. 找到环的入口节点（环形链表 II）\n3. 找链表中点（回文链表、排序链表）\n4. 找链表倒数第 k 个节点\n5. 判断链表是否相交\n6. 数组/序列中的重复数检测（如 287 题）',
    methods: '',
    tips: '1. 快慢指针模板：while (fast && fast->next) { slow = slow->next; fast = fast->next->next; }\n2. 判环时初始 slow 和 fast 都指向 head；若初始错开（fast=head->next），相遇逻辑不同需小心\n3. 找环入口（142 题）：相遇后 slow 回 head，两指针同速走，再次相遇处即入口\n4. 循环终止条件永远要先判断 fast 和 fast->next 非空，避免空指针\n5. 数组题中的「值域 + 快慢指针」变体（287 题）本质是把数组当作链表来遍历',
    createdAt: '2026-07-30T19:00:00'
  },
  {
    id: 16, name: '双指针', category: '技巧',
    summary: '用两个指针（下标/节点引用）协同遍历，常见于数组、链表、字符串题目，可将 O(n²) 优化到 O(n)',
    content: '双指针（Two Pointers）是一种通过维护两个指针（数组下标、迭代器或链表节点）来减少遍历次数的技巧。\n\n三种常见模式：\n1. 同向指针（快慢指针）：\n   - 慢指针 slow、快指针 fast，同向不同速\n   - 用于：判环、找中点、去重（原地）、滑动窗口\n2. 对撞指针（左右指针）：\n   - 左指针 left 从 0 开始，右指针 right 从尾部开始，向中间靠拢\n   - 用于：有序数组两数之和、反转数组、判断回文、盛水容器\n3. 并行指针（多链表/多数组归并）：\n   - 两指针分别在两个序列上推进\n   - 用于：合并有序链表、找两链表相交点、比较两个字符串\n\n核心思想：\n利用指针之间的「相对位置」或「步调差」来简化问题，避免重复扫描。',
    methods: '',
    tips: '1. 对撞指针模板：while (left < right) { ...; if (条件) left++; else right--; }\n2. 有序数组的题目优先想对撞指针，O(n²) 暴力可降到 O(n)\n3. 相交链表的核心技巧：两个指针走完自己的链表后「换边继续走」，消除长度差\n4. 原地去重（26 题）：快指针扫描，慢指针指向「下一个要填的位置」\n5. 双指针常和「排序」配合：无序时先排序再双指针\n6. 滑动窗口本质也是双指针：右指针扩张、左指针收缩维护窗口',
    createdAt: '2026-07-30T20:00:00'
  },
  {
    id: 17, name: 'Boyer-Moore投票法', category: '技巧',
    summary: '用「配对抵消」的思想在 O(1) 空间内找出出现次数超过一半的元素',
    content: 'Boyer-Moore 投票算法（Majority Vote Algorithm）是一种在线性时间、常数空间内找出「众数」（出现次数超过一半的元素）的算法。\n\n核心思想：\n把数组想象成投票现场，candidate 是当前候选人，count 是其「净票数」。\n- 遇到与 candidate 相同的元素，count++（投赞成票）\n- 遇到不同的元素，count--（投反对票，互相抵消）\n- 当 count 归零，说明当前候选人已被完全抵消，下一个元素成为新候选人\n\n正确性证明：\n多数元素出现次数 > n/2。假设极端情况——把多数元素和所有其他元素一对一抵消，\n多数元素仍会剩余至少 1 个。因此最终的 candidate 必然是多数元素。\n\n关键限制：\n本算法只保证「若存在多数元素，返回的一定是它」，不保证「返回的一定是多数元素」。\n如果不确定多数元素一定存在，需要第二次遍历统计 candidate 的实际出现次数来验证。',
    methods: '',
    tips: '1. 使用前提：题目保证存在出现次数 > n/2 的元素，否则要二次遍历验证\n2. 变体：找出出现次数 > n/3 的元素（至多 2 个）——用两个 candidate 和两个 count\n3. 不要把 Boyer-Moore 和字符串匹配的 Boyer-Moore 算法混淆（那是另一个算法）\n4. 相比哈希表 O(n) 空间、排序 O(n log n)，投票法 O(n) 时间 + O(1) 空间是最优\n5. 思考角度：多数元素的「多数」意味着它能扛住所有其他元素的联合抵消',
    createdAt: '2026-07-30T21:00:00'
  },
  {
    id: 18, name: '原地哈希', category: '技巧',
    summary: '利用「值域与下标范围一致」的特性，把数组本身当作哈希表，实现 O(1) 额外空间',
    content: '原地哈希（In-place Hashing / Index as Hash）是一种巧妙的数组技巧。当题目给出「数组长度为 n，元素值在 [1, n]（或 [0, n-1]）范围内」时，元素的取值空间恰好与下标一一对应，于是可以直接用「数组下标」来记录信息，省去额外的哈希表。\n\n常见做法：\n1. 负号标记：把「数字 v 出现过」记作 nums[v-1] = -|nums[v-1]|，利用符号位存储信息\n2. 交换归位：把每个元素交换到它「应该在」的位置，最后检查哪些位置不对\n3. 加偏移量：把 nums[v-1] += n（加一个超出范围的偏移量），最后用取模还原\n\n适用场景：\n- 数组长度为 n，元素值在 [1, n] 内\n- 求缺失的数字、重复的数字、出现次数等\n- 要求 O(1) 额外空间',
    methods: '',
    tips: '1. 识别特征：值域 [1, n] 且长度也是 n —— 这是原地哈希的「天选之题」\n2. 负号标记时必须先 abs 取值，因为值可能已被改过\n3. 相关题目：41 缺失的第一个正数、442 数组中重复的数据、268 缺失数字、287 寻找重复数\n4. 注意副作用：原地哈希会修改数组，如果题目要求保持原数组需先复制或用加偏移量的方式\n5. 与哈希表的区别：哈希表 O(n) 空间，原地哈希 O(1) 空间，是面试官想要的优化方向',
    createdAt: '2026-07-31T12:00:00'
  },
  {
    id: 19, name: '滑动窗口', category: '算法思想',
    summary: '用左右指针维护一个「窗口」，右指针扩张、左指针收缩，在 O(n) 时间解决子数组/子串问题',
    content: '滑动窗口（Sliding Window）是一种用于解决「子数组/子串」问题的双指针技巧。维护一个由 left 和 right 两个指针圈定的窗口，通过不断「右指针扩张、左指针收缩」来遍历所有可能的窗口，寻找满足条件的最优窗口。\n\n核心框架：\n  left = 0\n  for (right = 0; right < n; right++) {\n      将 s[right] 加入窗口（更新窗口状态）\n      当窗口不满足条件时：\n          收缩：left++（并更新窗口状态）\n      更新答案（窗口大小 = right - left + 1）\n  }\n\n适用场景：\n- 无重复字符的最长子串\n- 最小覆盖子串\n- 长度最小的子数组（和 >= target）\n- 字符串排列、异位词\n- 滑动窗口最大值\n\n核心思想：\n每个右端点只对应一个「最优左端点」，用两个指针即可覆盖所有情况，\n避免 O(n²) 的暴力枚举，降到 O(n)。',
    methods: '',
    tips: '1. 滑动窗口三步：扩张 right → 收缩 left（不满足条件时）→ 更新答案\n2. 「何时收缩」是难点：要能用一个条件/计数器判断窗口是否有效（如字符出现次数）\n3. 窗口状态维护：常用 unordered_map（字符频率）或 vector<int>（定长字符集计数）\n4. 求最长窗口 vs 最短窗口的收缩时机不同：最长窗口在「不满足时收缩」，最短窗口在「满足时收缩」\n5. 先写暴力，再套滑动窗口模板，是这类题的标准思路',
    createdAt: '2026-07-31T17:00:00'
  },
  {
    id: 20, name: '中心扩展法', category: '技巧',
    summary: '回文串关于中心对称，枚举所有回文中心并向两边扩展，O(n²) 求解回文类问题',
    content: '中心扩展法（Expand Around Center）是解决「回文子串」问题的经典技巧。利用回文串的对称性，把每个「中心」当作轴，向两边逐一扩展判断字符是否相等，从而找到以该中心为轴的最长回文。\n\n回文中心的两种类型：\n1. 奇数长度回文：中心是单个字符，如 a(b)a 的中心是 b\n2. 偶数长度回文：中心是两个字符之间的间隙，如 ab|ba\n一个长度为 n 的字符串共有 2n-1 个回文中心（n 个字符 + n-1 个间隙）。\n\n核心代码模板：\n  int expand(s, l, r) {           // 从 (l, r) 向两边扩展\n      while (l >= 0 && r < n && s[l] == s[r]) { l--; r++; }\n      return r - l - 1;           // 回文长度\n  }\n  for (int i = 0; i < n; i++) {\n      expand(s, i, i);            // 奇数中心\n      expand(s, i, i + 1);        // 偶数中心\n  }\n\n适用场景：\n- 最长回文子串（5 题）\n- 回文子串个数（647 题）\n- 回文对、最长回文序列的变形\n\n时间复杂度 O(n²)，空间复杂度 O(1)，实现简单，面试常考。',
    methods: '',
    tips: '1. 记住两种中心：单字符中心 + 字符间隙中心，共 2n-1 个\n2. expand 返回 r-l-1：扩展结束 l、r 已越过边界，回文长度 = 原区间长度\n3. 求回文起点：start = i - (len-1)/2，奇偶长度通用\n4. 与 DP 的对比：中心扩展 O(1) 空间，DP O(n²) 空间但能直接查询任意区间是否回文\n5. 进阶：Manacher 算法 O(n)，利用回文半径优化，竞赛/面试加分项',
    createdAt: '2026-07-31T18:00:00'
  },
  {
    id: 21, name: '回溯算法', category: '算法思想',
    summary: 'DFS + 状态撤销，系统地穷举所有可能解，适合组合、排列、子集、搜索类问题',
    content: '回溯算法（Backtracking）是一种通过「深度优先搜索 + 状态撤销」来系统穷举所有可能解的算法。它在搜索过程中，每当走到死路或找到解时，就回溯到上一步，撤销刚才的选择，尝试其他分支。\n\n核心框架：\n  void backtrack(参数) {\n      if (满足终止条件) { 记录结果; return; }\n      for (选择 in 当前可选集合) {\n          做出选择;          // ① 选择\n          backtrack(新参数);  // ② 递归\n          撤销选择;          // ③ 回溯（状态恢复）\n      }\n  }\n\n本质：\n回溯 = DFS 遍历一棵「决策树」，树的每一层对应一个决策位置，\n每个节点的分支是当前位置的所有可能选择。\n\n经典应用：\n- 组合问题：C(n,k)、组合总和\n- 排列问题：全排列、有重复元素的全排列\n- 子集问题：子集、分割回文串\n- 棋盘搜索：N 皇后、数独、单词搜索\n- 字符串：电话号码字母组合（17 题）',
    methods: '',
    tips: '1. 回溯三件套背熟：做出选择 → 递归 → 撤销选择\n2. 终止条件决定「何时算一个完整答案」，通常是递归层数达到目标\n3. 去重：同一层不能选重复元素，常用排序 + visited 数组或 used 标记\n4. 剪枝优化：提前排除不可能的分支（如排序后提前 break）\n5. 时间复杂度通常是指数级（O(分支数^层数)），数据规模大时需要剪枝\n6. 与递归的区别：递归是通用手段，回溯是「带状态撤销的递归搜索」',
    createdAt: '2026-07-31T21:00:00'
  },
  {
    id: 22, name: '二分查找', category: '算法思想',
    summary: '在有序（或部分有序）序列中每次排除一半，O(log n) 时间查找目标',
    content: '二分查找（Binary Search）是一种在有序序列中高效查找的算法。每次取中间元素与目标比较，根据大小关系排除一半的搜索区间，从而将时间复杂度从 O(n) 降到 O(log n)。\n\n基础模板（标准有序数组）：\n  int binarySearch(vector<int>& nums, int target) {\n      int left = 0, right = nums.size() - 1;\n      while (left <= right) {\n          int mid = left + (right - left) / 2;  // 防溢出写法\n          if (nums[mid] == target) return mid;\n          else if (nums[mid] < target) left = mid + 1;\n          else right = mid - 1;\n      }\n      return -1;\n  }\n\n三个关键变量：\n- left / right：当前搜索区间 [left, right]\n- mid：区间中点，用于对半划分\n- 循环条件 left <= right：区间非空时继续\n\n适用场景：\n- 有序数组查找目标\n- 查找左/右边界（lower_bound / upper_bound）\n- 旋转排序数组查找（33 题）\n- 答案二分：在「值域」上二分（如 875 题爱吃香蕉的珂珂）\n- 峰值元素查找（162 题）',
    methods: '',
    tips: '1. 三个易错点：①mid 防溢出用 left + (right-left)/2 ②循环条件 left<=right ③更新 left=mid+1 / right=mid-1 防死循环\n2. 找边界（第一个/最后一个等于 target）时，相等的情况也要收缩，配合 left<right 的模板\n3. 旋转数组题的关键：先判断哪一半有序，再决定去哪一半搜\n4. 「答案二分」思想：直接对答案值域二分，验证 mid 是否满足条件，常用于最大化最小值/最小化最大值\n5. 二分不只适用于数组，也适用于单调函数（猜数游戏、浮点数二分）',
    createdAt: '2026-08-01T10:00:00'
  },
  {
    id: 23, name: '矩阵操作', category: '技巧',
    summary: '二维矩阵的遍历与变换技巧：转置、旋转、螺旋、对角线等，常要求原地操作',
    content: '矩阵操作（Matrix）是 LeetCode 中常见的题型，二维 vector<vector<int>> 表示矩阵。核心是掌握一些固定的变换规律和遍历模板。\n\n常见变换：\n1. 转置（沿主对角线翻转）：swap(matrix[i][j], matrix[j][i])，内层循环 j 从 i+1 开始\n2. 顺时针旋转 90°：转置 + 反转每一行\n3. 逆时针旋转 90°：转置 + 反转每一列（或先反转每行再转置）\n4. 螺旋遍历：按 上→右→下→左 四个方向逐层收缩边界\n5. 对角线遍历：主对角线 i==j，副对角线 i+j==n-1\n\n原地操作要点：\n- 只能用 swap 交换元素，不能用额外矩阵\n- 逐层处理（外层到内层），每层圈定一个环\n\n常见题型：\n- 旋转图像（48 题）\n- 螺旋矩阵（54 题）\n- 矩阵置零（73 题）\n- 搜索二维矩阵（74/240 题）',
    methods: '',
    tips: '1. 转置的循环模板：for (i) for (j = i+1) swap(matrix[i][j], matrix[j][i])\n2. 记住旋转口诀：顺时针 = 转置 + 反转行；逆时针 = 转置 + 反转列\n3. 螺旋遍历用四个边界变量 top/bottom/left/right，每次处理一行/列后收缩\n4. 下标写错是矩阵题最大坑，画个 3×3 小矩阵验证\n5. 网格 DFS/BFS 题（岛屿数量、腐烂橘子）也属于矩阵操作，配合方向数组 dirs',
    createdAt: '2026-08-01T16:00:00'
  },
  {
    id: 24, name: '荷兰国旗问题', category: '技巧',
    summary: '三指针（left/curr/right）把数组分成三段，一趟 O(n) 原地排序三类元素',
    content: '荷兰国旗问题（Dutch National Flag Problem）由 Dijkstra 提出：用三种颜色的球代表三类元素，通过三指针一趟扫描把它们原地排列成有序的三段。是「三路快排 partition」的经典实现。\n\n核心思想：\n用三个指针维护三个区域：\n- left：左侧全部是 0（第一类）\n- right：右侧全部是 2（第三类）\n- curr：扫描指针，从左向右处理中间「未确定」区域\n\n循环不变式：\n  [0, left) 全是 0\n  [left, curr) 全是 1\n  (right, n-1] 全是 2\n  [curr, right] 待处理\n\n核心代码模板：\n  void sortThree(vector<int>& nums) {\n      int left = 0, curr = 0, right = nums.size() - 1;\n      while (curr <= right) {\n          if (nums[curr] == 0) {\n              swap(nums[left], nums[curr]);\n              left++; curr++;   // 换来的只可能是 0/1，curr 前进\n          } else if (nums[curr] == 2) {\n              swap(nums[curr], nums[right]);\n              right--;          // 换来的可能是 2，curr 不动重查\n          } else {\n              curr++;           // 1 直接跳过\n          }\n      }\n  }\n\n关键细节：\n- 与 right 交换后 curr 不前进（换来的值未知，需重新判断）\n- 与 left 交换后 curr 前进（left 位置只可能是 0/1，因为 2 已被换到右边）\n\n适用场景：\n- 颜色分类（75 题）\n- 三路快速排序的 partition\n- 把数组按某个值分成小于/等于/大于三段\n- 奇偶分离、正负分离（两指针即可）',
    methods: '',
    tips: '1. 三指针分工：left 收 0、right 收 2、curr 扫描，循环条件 curr <= right\n2. 唯一难点是 curr 何时前进：换 right 不前进（值未知），换 left 前进（值确定非 2）\n3. 相比计数排序（两遍遍历），荷兰国旗只需一遍、且是原地交换（稳定性差但本题无所谓）\n4. 本质是「三路 partition」：可用于快速排序处理大量重复元素时避免退化 O(n²)\n5. 两路 partition（快排普通版）是荷兰国旗的特例：只分小于/不小于，用两个指针即可',
    createdAt: '2026-08-01T23:00:00'
  },
  {
    id: 26, name: '单调栈', category: '技巧',
    summary: '维护栈内元素单调递增/递减，均摊 O(n) 解决「下一个更大/更小元素」类问题',
    content: '单调栈（Monotonic Stack）就是栈内元素保持单调递增或单调递减的栈。当新元素破坏单调性时，把不符合的栈顶元素弹出，弹出的时机恰好就是「答案揭晓」的时机。\n\n两种典型形态：\n- 递减栈（栈底到栈顶递减）：用于找「下一个更大元素」——新元素比栈顶大时，栈顶弹出且新元素就是它的答案（如 739 每日温度、42 接雨水）。\n- 递增栈（栈底到栈顶递增）：用于找「左右第一个更矮的元素」——如 84 柱状图最大矩形，每根柱子向两侧扩展到更矮处。\n\n复杂度：每个元素至多入栈一次、出栈一次，总时间均摊 O(n)，空间 O(n)。\n\n经典题目：739 每日温度、84 柱状图中最大的矩形、85 最大矩形、42 接雨水（栈解法）、496/503 下一个更大元素、901 股票价格跨度。',
    methods: '入栈 O(1)（均摊，含弹栈）| 弹栈触发「结算」 | 找下一个更大元素用递减栈 | 找左右更矮边界用递增栈 | 哨兵可简化边界处理',
    tips: '1. 栈里通常存「下标」而不是值：答案要算距离/宽度时需要下标，值可以反查\n2. 弹栈结算写在「新元素入栈之前」，入栈是每个元素的最后一步\n3. 在数组首尾加哨兵（如 84 题两端加高度 0）可以自动清空栈内残留，避免遗漏结算\n4. 与「滑动窗口」区分：单调栈处理的是「每个元素等待它右边第一个更大/更小」，没有窗口移动；单调队列才处理窗口',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 27, name: '堆', category: 'STL 容器',
    summary: 'priority_queue 优先队列：O(log n) 插入/删除、O(1) 取最值，Top-K 与合并流数据的利器',
    content: '堆（Heap）是完全二叉树，父节点总是 >=（大顶堆）或 <=（小顶堆）子节点。C++ 的 priority_queue 是堆的容器适配器，默认为「大顶堆」。\n\n刷题三大用途：\n1. Top-K 问题：维护大小为 k 的堆（求第 k 大用小顶堆，堆顶就是门槛），如 215、347\n2. 多路归并：k 个有序序列每次取全局最小，如 23 合并 K 个链表、253 会议室 II\n3. 动态数据流的中位数/最值：数据不断到来时堆是唯一选择（如 295 数据流中位数）\n\nC++ 小顶堆写法：\npriority_queue<int, vector<int>, greater<int>> pq;\n自定义类型需要重载 operator() 的比较器结构体（比较器方向与堆序相反，易错）。\n\n复杂度：push/pop O(log n)，top O(1)。',
    methods: 'push(x) | 插入元素，堆自动调整 | O(log n)\npop() | 移除堆顶（不含删除返回值） | O(log n)\ntop() | 访问堆顶（最大/最小） | O(1)\nsize() / empty() | 元素个数 / 是否为空 | O(1)',
    tips: '1. 求第 k 大用「小顶堆」且堆大小保持 k：新元素大于堆顶才替换，堆顶即第 k 大\n2. priority_queue 没有 clear()，也没有遍历接口；需要遍历时用 vector + make_heap 或直接改用 multiset\n3. 自定义比较器：struct Cmp { bool operator()(Node* a, Node* b) { return a->val > b->val; } }; 大于号对应小顶堆，方向容易写反\n4. pair 比较默认按 first 优先，堆题常存 (频次, 元素) 类型的 pair\n5. 能用「快速选择」的静态数组 Top-K 别硬上堆：堆是 O(n log k)，快选期望 O(n)；但数据流场景只能用堆',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 28, name: '前缀树', category: '数据结构',
    summary: 'Trie 前缀树：按字符逐层存储的多叉树，O(L) 完成单词插入/查找/前缀匹配',
    content: '前缀树（Trie，字典树）把多个字符串按「公共前缀」合并存储在一棵多叉树里：从根到某节点的路径拼出一个前缀，公共前缀只存一份。\n\n节点结构（小写字母场景）：\nstruct TrieNode { TrieNode* children[26]; bool isEnd; };\nisEnd 标记「到此处为止是一个完整单词」。\n\n三大核心操作，复杂度均为 O(单词长度 L)：\n- insert(word)：逐字符下探，缺孩子就建\n- search(word)：逐字符下探，走完且 isEnd 为 true 才算存在\n- startsWith(prefix)：同 search 但不检查 isEnd\n\n适用场景：前缀匹配、词频统计、单词自动补全、异或对（01-Trie 变体）。刷题中 208 实现前缀树是模板题，211、212、648 都在其上加变化。',
    methods: 'insert(word) | 插入单词 | O(L)\nsearch(word) | 查完整单词（要求 isEnd） | O(L)\nstartsWith(prefix) | 查前缀存在 | O(L)\n空间 | 总字符数 × 字符集大小 | O(N·L·26)',
    tips: '1. 根节点不对应任何字符，第一个字符从 root 的孩子开始找\n2. search 与 startsWith 的区别只在结尾是否检查 isEnd——「前缀存在」不等于「单词存在」\n3. 字符集固定用数组 children[26]（快），字符集大或稀疏用 unordered_map（省空间）\n4. 若需要按前缀汇总（如统计以某前缀开头的单词数），节点上可加 pass 计数字段',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 29, name: '拓扑排序', category: '算法思想',
    summary: '对有向无环图排序使所有边都从前指向后，Kahn 入度法与 DFS 染色法两种实现',
    content: '拓扑排序（Topological Sort）针对有向图，输出一个节点序列，使得每条有向边 (u,v) 中 u 都排在 v 前面。当且仅当图无环（DAG）时存在拓扑序，因此拓扑排序天然承担「判环」职责。\n\n方法一：Kahn 算法（BFS，推荐）\n1. 统计所有点入度，入度为 0 的点入队（没有前置依赖）\n2. 出队、加入结果；其所有后继入度 -1，减到 0 的入队\n3. 出队总数 < 节点总数 → 图中有环，无拓扑序\n\n方法二：DFS 三色标记\n状态 0 未访问 / 1 访问中 / 2 已完成。DFS 中遇到「访问中」的点说明出现回边（环）。「已完成」节点的逆序即一个拓扑序。\n\n典型应用：课程表（207/210）、编译依赖、任务调度顺序、判断有向图是否有环。\n\n复杂度：时间 O(V+E)，空间 O(V+E)。',
    methods: 'Kahn 入度 BFS | 入度 0 入队，出队消边 | O(V+E)\nDFS 染色 | 三色标记判环 + 逆序输出 | O(V+E)\n判环依据 | Kahn：出队数 < V；DFS：遇「访问中」 | —',
    tips: '1. 建边方向要先想清楚：先修 b 才能修 a 应建 b→a 且入度记在 a 上，方向反了拓扑序正好颠倒\n2. Kahn 初始要把「所有」入度 0 的点入队，不是一个\n3. 需要输出拓扑序（210 题）时用结果数组收集；只要判环时比较计数即可\n4. 拓扑序不唯一；若要求字典序最小的拓扑序，把 Kahn 的队列换成小顶堆按编号取',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 30, name: '前缀和', category: '技巧',
    summary: '预处理前缀和使任意区间和 O(1) 可得，配合哈希表解决「和为 k 的子数组」计数',
    content: '前缀和（Prefix Sum）：pre[i] = nums[0] + ... + nums[i-1]，约定 pre[0] = 0。\n任意区间 [l, r] 的和 = pre[r+1] - pre[l]，把 O(n) 的求和降到 O(1)。\n\n两大用法：\n1. 静态区间和：预处理一次、多次查询（或直接边扫边用）\n2. 子数组和计数/存在性：子数组 (j, i] 的和为 k ⟺ pre[i+1] - pre[j] = k ⟺ 找之前出现过的 pre - k。用哈希表统计「前缀和 → 出现次数」，一遍扫描完成（560 和为K的子数组、1248 优美子数组）\n\n树上推广：节点到根的路径和也是前缀和，配合哈希表可解 437 路径总和 III。\n\n变体：前缀积（238 除自身以外数组的乘积）、差分数组（区间批量加减，还原时再做前缀和）。\n\n复杂度：预处理 O(n)，单次区间查询 O(1)；哈希计数版整体 O(n)。',
    methods: 'pre[i] 计算 | 一次线性扫描 | O(n)\n区间和 [l,r] | pre[r+1] - pre[l] | O(1)\n和为 k 计数 | 哈希表存前缀和次数，查 cur-k | O(n)\n差分数组 | 区间修改 O(1)，还原 O(n) | —',
    tips: '1. 哈希计数版必须初始 cnt[0]=1（空前缀），否则「从下标 0 开始且和恰为 k」的子数组会漏\n2. 「先查 cur-k 再插 cur」的顺序不能反，否则 k=0 时会把空区间算进去\n3. 前缀和可正可负，计数要用 unordered_map 而非数组\n4. 有负数时滑动窗口失效，前缀和 + 哈希是「和为 k 子数组」的唯一 O(n) 解',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 31, name: '单调队列', category: '技巧',
    summary: '双端队列维护滑动窗口内的单调性，均摊 O(1) 求移动窗口的最值',
    content: '单调队列（Monotonic Queue）用双端队列（deque）维护「窗口内候选元素的单调序列」，解决「滑动窗口最大/最小值」类问题。\n\n以窗口最大值（239 题）为例，维护「下标对应值递减」的队列：\n1. 新元素入队前，从队尾弹出所有值 <= 新元素的下标（它们不可能再成为最大值）\n2. 新元素下标入队\n3. 队首下标滑出窗口（队首 <= i-k）时 pop_front\n4. 队首恒为当前窗口最大值的下标\n\n与单调栈的区别：单调队列有「队首过期弹出」——因为窗口左边界在移动，队首元素会随窗口滑走；栈没有出栈方向的时效性。\n\n复杂度：每个元素至多入队一次、出队（队尾或队首）一次，均摊 O(1)，总 O(n)。',
    methods: '队尾清理 | 弹出所有 <= 新元素的队尾 | 均摊 O(1)\n入队 | 新下标入队尾 | O(1)\n队首过期 | 队首下标滑出窗口则弹出 | 均摊 O(1)\n取最值 | 读队首下标对应的值 | O(1)',
    tips: '1. 队列存「下标」：判过期要比较下标与窗口左边界\n2. 队尾弹出的条件包含等于（<=）：相等时旧元素比新元素先过期，留着无意义\n3. 三个动作顺序固定：队尾清理 → 入队 → 队首过期清理 → 取队首\n4. 求「窗口最小值」把单调方向反过来（维护递增队列）即可',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 32, name: '背包问题', category: '算法思想',
    summary: '「从物品集合中选取凑目标值」的 DP 模型：0-1 背包倒序、完全背包正序',
    content: '背包问题是「选与不选」类 DP 的总模型：给定物品（重量/价值），在容量限制下求最值、方案数或可行性。刷题中最常用的是一维滚动数组形式：\n\n0-1 背包（每个物品至多选一次）：\nfor 物品 i: for j 从 target 倒序到 w[i]: dp[j] = op(dp[j], dp[j-w[i]] + v[i])\n倒序保证 dp[j-w[i]] 还是「上一行」的值，物品不会被重复使用。\n典型题：416 分割等和子集（可行性）、494 目标和（方案数）。\n\n完全背包（每个物品可选无限次）：\nfor 物品 i: for j 从 w[i] 正序到 target: dp[j] = op(dp[j], dp[j-w[i]] + v[i])\n正序允许同一物品在更小容量时已被选用。\n典型题：322 零钱兑换（最少件数）、279 完全平方数、139 单词拆分（可行性）。\n\n求方案数时 op 是加法（dp[j] += dp[j-w]），求最值时是 min/max，可行性时是 or。求「组合数」要求外层物品内层容量；求「排列数」则外层容量内层物品（如 377 组合总和 IV）。',
    methods: '0-1 背包 | j 倒序枚举 | O(n×target)\n完全背包 | j 正序枚举 | O(n×target)\n方案数 | dp[j] += dp[j-w]，dp[0]=1 | 同上\n可行性 | dp[j] |= dp[j-w]，dp[0]=true | 同上',
    tips: '1. 一维滚动数组方向是命门：0-1 倒序、完全正序，写反就是把 0-1 变完全、完全变 0-1\n2. 计数型背包 dp[0]=1（空集方案），最值型 dp[0]=0，初始化含义别混\n3. 「求最少件数」的完全背包内外层顺序无所谓（min 与组合/排列无关），「求方案数」必须区分组合与排列\n4. 先做转化：分割等和子集→子集和 sum/2；目标和→子集和 (sum-target)/2；转化对了才是背包',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 33, name: '分治', category: '算法思想',
    summary: '分解-解决-合并三步走，子问题独立不重叠，代表为归并排序与二分',
    content: '分治（Divide and Conquer）把问题分解成若干「相互独立」的子问题，递归求解后合并结果。与 DP 的区别：DP 的子问题重叠（要记忆化避免重复计算），分治的子问题各不相干（如数组的左右两半）。\n\n三步框架：\n1. 分解：把规模 n 的问题拆成若干规模更小的同类子问题\n2. 解决：子问题足够小直接求解\n3. 合并：把子问题结果合并成原问题答案\n\n刷题代表：\n- 归并排序 / 排序链表（148）：拆两半各自排好，再线性合并\n- 合并 K 个链表（23）：两两分治合并，O(n log k)\n- 最大子数组和分治版（53）：答案 = max(左段答案, 右段答案, 横跨中点的最大和)\n- 寻找两个正序数组的中位数（4）：每次排除 k/2 个元素\n- 快速排序/快速选择：按 pivot 划分，只递归一侧（快选）\n\n复杂度分析：T(n) = a·T(n/b) + O(n^d)，可用主定理，归并类通常 O(n log n)。',
    methods: '分解 | 拆成独立子问题（常对半拆） | O(1)~O(n)\n解决 | 递归到边界直接算 | —\n合并 | 线性合并子结果 | O(n)\n复杂度 | T(n)=aT(n/b)+f(n)，主定理求解 | 多为 O(n log n)',
    tips: '1. 判断分治适用的标志：左右两半能「独立」求解、结果能直接拼——子问题有依赖就转 DP 或贪心\n2. 「横跨中点」的分治题（53）需要额外递归求「从边界延伸的最大前/后缀和」\n3. 归并排序模板要背熟：找中点、断链、递归、合并，链表版（148）与数组版细节不同\n4. 快速选择 = 快排只递归一侧，均摊 O(n)，是「第 k 大」类题期望线性解',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 34, name: '二叉搜索树', category: '数据结构',
    summary: '左子树 < 根 < 右子树的有序二叉树，中序遍历升序，操作 O(h)',
    content: '二叉搜索树（BST, Binary Search Tree）每个节点满足：左子树所有节点值 < 根值 < 右子树所有节点值。\n\n核心性质：中序遍历（左根右）得到升序序列——这一条是所有 BST 题的钥匙：\n- 验证 BST（98）：中序遍历应严格递增\n- BST 第 k 小（230）：中序遍历数到第 k 个\n- 累加树（538）：反中序（右根左）得到降序，边遍历边累加\n- 有序数组转平衡 BST（108）：取中点做根递归构建\n\n查找/插入/删除都是「与当前节点比大小走左或右」，复杂度 O(h)（h 为树高；平衡时 O(log n)，退化链状时 O(n)）。\n\n最近公共祖先（235）：p、q 都小于当前节点走左，都大于走右，分居两侧时当前节点即 LCA。',
    methods: '查找/插入 | 比大小走左或右 | O(h)\n删除 | 叶子直接删；单孩子接上；双孩子用中序后继替换 | O(h)\n中序遍历 | 得到升序序列 | O(n)\n验证合法性 | 中序严格递增（不能只比较父子） | O(n)',
    tips: '1. 验证 BST 不能只比较「父节点与孩子」：要传递 (min, max) 上下界或用中序递增判断，否则 [5,4,6,null,null,3,7] 这类反例过不了\n2. 中序序列升序这条性质几乎能秒掉一半 BST 题，先想它\n3. 删除双子节点：用「右子树最小（中序后继）」替换值后转化为删除后继节点\n4. BST 题的递归常可用迭代（循环走左右）实现，空间从 O(h) 降到 O(1)',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 35, name: '快速选择', category: '算法思想',
    summary: '快排的「只递归一侧」变体，期望 O(n) 求第 k 大/小元素',
    content: '快速选择（Quickselect）借快速排序的 partition 思想求「第 k 大/第 k 小」：\n\n1. 随机选 pivot，partition 把数组分成两段：一侧全 <= pivot、另一侧全 >= pivot（pivot 归位到下标 p）\n2. 若 p 恰好是目标位置（第 k 小对应下标 k-1），返回\n3. 目标在左侧就只在左半递归，在右侧就只在右半递归\n\n与快排的唯一区别：快排两侧都要递归 O(n log n)；快选每次只进入一侧，T(n) = T(n/2) + O(n) → 期望 O(n)，最坏 O(n²)（随机化 pivot 规避）。\n\n适用：静态数组的第 k 大（215）、频次 Top-K 的划分（347 进阶）。数据流/动态数据请用堆。\n\n对比堆：堆 O(n log k) 但可处理流；快选期望 O(n) 但要求数组可随机访问且一次性给出。',
    methods: 'partition | 选 pivot 划分，pivot 归位 | O(n)\n递归一侧 | 目标位置在哪侧去哪侧 | 期望 O(n)\n随机化 pivot | 防最坏 O(n²) | —',
    tips: '1. 「第 k 大」= 升序第 n-k+1 小（下标 n-k），换算别搞反方向\n2. partition 有「挖坑法」与「交换法」两种写法，背熟一种即可，边界相等元素的处理要一致\n3. 三路划分（< / = / > 三段）可以一次排掉所有等于 pivot 的元素，重复值多时大幅加速\n4. 面试官问「最坏情况怎么办」：答随机化 pivot + 三路划分，或改用中位数的中位数（BFPRT）保证 O(n)',
    createdAt: '2026-09-02T10:00:00'
  },
];

// ===================================================================
// 默认易混淆点数据
// ===================================================================
const DEFAULT_CONFUSIONS = [
  {
    id: 1,
    title: '二分查找循环条件：left <= right vs left < right',
    category: '二分查找',
    confusion: '写二分查找时，循环条件到底是 while (left <= right) 还是 while (left < right)？终止后返回 left 还是 right？',
    difference: '1. while (left <= right)：搜索区间是「闭区间 [left, right]」，left 和 right 都可能指向目标。\n   循环结束后 left = right + 1，此时 left 是第一个大于目标的位置，right 是最后一个小于目标的位置。\n   ✓ 适用于「查找某个确切值」：mid == target 时直接返回 mid。\n\n2. while (left < right)：搜索区间是「左闭右开 [left, right)」或「开区间」，终止时 left == right。\n   循环结束后 left == right，无法区分「找到」和「没找到」，通常配合二分答案或查找边界使用。\n   ✓ 适用于「查找左/右边界」：因为终止时 left 就是第一个满足条件的位置。\n\n记忆技巧：\n- 找确切值（nums[mid] == target 直接返回）→ 用 <=，循环体内分三种情况\n- 找边界/二分答案（收缩区间逼近）→ 常用 <，终止后 left 即答案候选\n- 用 < 时，mid 的计算要配合「找左边界用 mid = left + (right-left)/2，找右边界用 mid = left + (right-left+1)/2（向上取整）」，否则会死循环',
    example: '// 找确切值：用 <=\nwhile (left <= right) {\n    int mid = left + (right - left) / 2;\n    if (nums[mid] == target) return mid;\n    else if (nums[mid] < target) left = mid + 1;\n    else right = mid - 1;\n}\n\n// 找左边界（第一个 >= target）：用 <\nwhile (left < right) {\n    int mid = left + (right - left) / 2;\n    if (nums[mid] >= target) right = mid;  // 收缩右边界\n    else left = mid + 1;\n}\nreturn left;  // left == right，就是左边界',
    tips: '口诀：找值用 <=，找边界用 <；用 < 时注意 mid 的取整方向，找右边界要向上取整，否则死循环。',
    createdAt: '2026-08-01T14:00:00'
  },
  {
    id: 2,
    title: '子串 vs 子序列',
    category: '字符串',
    confusion: '子串（substring）和子序列（subsequence）都能从原字符串中按原顺序选出，但范围大小一样吗？',
    difference: '子串是原字符串中「连续的一段」；子序列是「按原顺序但不要求连续」地选取。\n\n例：s = "abc"\n- 子串：a、ab、abc、b、bc、c（都是连续的）\n- 子序列：除了上面这些，还有 ac（跳过了 b）\n\n结论：子串一定是子序列，但子序列不一定是子串。\n\n解题思路区分：\n- 求「子串」的最优解（最长无重复、最长回文）→ 滑动窗口 / 中心扩展 / 双指针\n- 求「子序列」的最优解（最长公共子序列、最长递增子序列）→ 动态规划',
    example: '',
    tips: '记法：子串 = 连在一起的切片（slice）；子序列 = 允许跳着挑。看到「连续」二字就是子串，看到「不改变相对顺序」就是子序列。',
    createdAt: '2026-08-01T15:00:00'
  },
  {
    id: 3,
    title: '递归 vs 迭代',
    category: '算法思想',
    confusion: '很多题既可以用递归又可以用迭代解（如遍历、反转链表），到底怎么选？',
    difference: '递归：函数调用自身，代码简洁、逻辑贴近数学定义，但每次调用占用栈空间，空间复杂度 = 递归深度，深度过大会栈溢出。\n\n迭代：用循环 + 显式维护栈/队列，空间可控（通常 O(1) 或显式 O(n)），但代码略繁琐。\n\n选择建议：\n- 树/图遍历、分治、回溯：天然递归，代码清晰，优先递归\n- 线性遍历、对空间敏感、递归深度可能 > 10^4：用迭代\n- 链表反转这类简单线性操作：迭代（三指针）最直观',
    example: '',
    tips: '递归擅长「分形结构」，迭代擅长「线性推进」。能用尾递归优化的题，迭代往往更优。',
    createdAt: '2026-08-01T15:00:00'
  },
  {
    id: 4,
    title: 'DFS vs BFS',
    category: '算法思想',
    confusion: '深度优先搜索（DFS）和广度优先搜索（BFS）都用于遍历/搜索，什么时候用哪个？',
    difference: 'DFS（用栈或递归）：一路走到底再回头，空间 O(深度)，适合「求所有解、判断是否存在、回溯、全排列」。\n\nBFS（用队列）：逐层向外扩展，空间 O(宽度)，第一次到达某节点时路径一定最短，适合「求最短路径/最小步数、层序遍历」。\n\n典型场景：\n- 二叉树层序遍历、迷宫最短步数、单词接龙 → BFS\n- 全排列、组合、N 皇后、连通性判断 → DFS\n\n网格题两者都能做，但「最短步数」必须 BFS（或 Dijkstra）。',
    example: '',
    tips: '口诀：找最短路用 BFS，找所有路用 DFS；BFS 用队列，DFS 用栈（或递归）。',
    createdAt: '2026-08-01T15:00:00'
  },
  {
    id: 5,
    title: '二叉树的深度 vs 高度',
    category: '二叉树',
    confusion: '节点的深度和高度都描述层级位置，有什么区别？',
    difference: '深度（depth）：从根节点到该节点的距离，自上而下数，根深度为 0（或 1）。\n高度（height）：从该节点到最远叶子节点的距离，自下而上数，叶子高度为 0（或 1）。\n\n关键差异：深度是「从上面数下来」，高度是「从下面数上去」。\n\n做题时：\n- 求最大深度：dfs(root) 返回 max(左深, 右深) + 1\n- 求某个节点的高度：从该节点向下到叶子的最长路径\n- 直径 = 左子树高度 + 右子树高度（边数）',
    example: '',
    tips: '递归函数通常「返回高度、用参数或全局变量记录深度」。约定好 0 还是 1 是叶子，保持一致即可。',
    createdAt: '2026-08-01T15:00:00'
  },
  {
    id: 6,
    title: '二叉树前序 / 中序 / 后序遍历',
    category: '二叉树',
    confusion: '三种遍历顺序总记混，前序到底是「根左右」还是「左右根」？',
    difference: '核心在于「根节点在什么时机被访问」：\n- 前序：根 → 左 → 右（根最先访问）\n- 中序：左 → 根 → 右（根在中间，BST 的中序是升序）\n- 后序：左 → 右 → 根（根最后访问）\n\n记忆口诀：「前中后」指的是根的位置。\n\n递归实现只需调整访问根节点的代码位置；迭代实现：\n- 前序：栈 + 先压右再压左\n- 中序：一路向左入栈，出栈访问再转向右\n- 后序：双栈或「前序反转」技巧',
    example: '// 递归模板，只需移动这一行\nvoid order(TreeNode* root) {\n    if (!root) return;\n    // 前序：print(root->val) 放这里\n    order(root->left);\n    // 中序：print(root->val) 放这里\n    order(root->right);\n    // 后序：print(root->val) 放这里\n}',
    tips: '记死三句：前序根左右，中序左根右，后序左右根。「根」字的位置就是遍历的名字。',
    createdAt: '2026-08-01T15:00:00'
  },
  {
    id: 7,
    title: '判断对称 vs 判断相等',
    category: '二叉树',
    confusion: '判断二叉树是否对称（101 题）和判断两棵树是否相等，比较的方向一样吗？',
    difference: '相等：左子树对左子树、右子树对右子树（同向比较）。\n对称：左子树对右子树、右子树对左子树（交叉镜像比较）。\n\n判断对称的递归参数是「两棵子树」：\n- 左.left 与 右.right 比（外侧对外侧）\n- 左.right 与 右.left 比（内侧对内侧）\n\n边界条件相同：都空返回 true，一个空返回 false，值不同返回 false。',
    example: '// 对称的判断：交叉比较\nbool isSymmetric(TreeNode* t1, TreeNode* t2) {\n    if (!t1 && !t2) return true;\n    if (!t1 || !t2) return false;\n    if (t1->val != t2->val) return false;\n    return isSymmetric(t1->left, t2->right)   // 外侧对外侧\n        && isSymmetric(t1->right, t2->left); // 内侧对内侧\n}',
    tips: '看到「对称/镜像」就交叉比较，看到「相等/相同」就同向比较。',
    createdAt: '2026-08-01T15:00:00'
  },
  {
    id: 8,
    title: '二叉树的直径 vs 最大深度',
    category: '二叉树',
    confusion: '543 直径和 104 最大深度都是求最长路径，有什么区别？',
    difference: '最大深度：从根到最远叶子的「单向向下」路径长度。\n直径：任意两个节点之间的最长路径，可能不经过根，由「某节点的左子树高度 + 右子树高度」拼成（拐点在该节点）。\n\n实现区别：\n- 最大深度：每个节点返回 max(左,右) + 1，答案就在根节点\n- 直径：递归时在每个节点更新全局 max(左高 + 右高)，同时向上返回子树高度 max(左,右)+1',
    example: '',
    tips: '直径的套路：递归函数返回「高度」，但用全局变量在「每个节点」处更新 max(左高+右高)。因为最长路径的拐点可能在任意节点。',
    createdAt: '2026-08-01T15:00:00'
  },
  {
    id: 9,
    title: '贪心 vs 动态规划',
    category: '算法思想',
    confusion: '贪心和 DP 都用来求最优解，什么时候能用贪心，什么时候必须 DP？',
    difference: '贪心：每一步做「当前看起来最优」的选择，不能回退。只在「局部最优能推出全局最优」时正确（需要证明贪心选择性质）。\n\n动态规划：枚举所有可能的状态转移，保证全局最优，更通用。\n\n经典反例：\n- 0-1 背包：按价值/重量比贪心会选错，必须 DP\n- 找零钱（某些面额）：贪心可能不最优\n\n判断技巧：\n- 能证明「这一步的最优不影响后续」→ 贪心\n- 子问题有重叠、需要比较多种方案 → DP\n- 拿不准时先用 DP 保底，能证明贪心再优化',
    example: '',
    tips: '「贪心是赌徒，DP 是保险」。多数求最大/最小值的题先想 DP，贪心是锦上添花。',
    createdAt: '2026-08-01T15:00:00'
  },
  {
    id: 10,
    title: '排列 vs 组合',
    category: '回溯',
    confusion: '回溯生成排列（46 题）和组合（39/77 题），代码结构的关键区别是什么？',
    difference: '组合关心「选哪些」不关心顺序：[1,2] 和 [2,1] 是同一个组合。\n用 start 参数保证「只往前看」，不会生成重复组合。\n\n排列关心「顺序」：[1,2] 和 [2,1] 是两个不同排列。\n每层从下标 0 开始枚举所有「还没用过的元素」（used 数组标记），path 长度到 n 即完成。\n\n核心差异一句话：\n- 组合用 start（限制起点）\n- 排列用 used（限制已用元素）',
    example: '',
    tips: '看到「顺序无关」用 start 起步；看到「顺序敏感」用 used 标记。这是回溯两类题的分水岭。',
    createdAt: '2026-08-01T15:00:00'
  },
  {
    id: 11,
    title: '组合总和：可重复选 vs 不可重复选',
    category: '回溯',
    confusion: '39 题数字可以无限重复选，40 题每个数字只能用一次，代码到底差在哪？',
    difference: '两处关键区别：\n\n1. 递归的 start 参数：\n   - 可重复选：start 传 i（当前数字还能继续选）\n   - 不可重复选：start 传 i+1（当前数字用过就不能再选）\n\n2. 同层去重（40 题特有）：\n   - 先排序，同一层循环中若 nums[i] == nums[i-1] 则跳过（因为 nums[i-1] 已经在这一层试过了，会生成重复组合）\n\n例：candidates=[1,2,2,5], target=5\n不可重复选时，第二个 2 在第一个 2 已试过的层里要跳过。',
    example: '// 可重复选（39 题）\nbacktrack(candidates, target - candidates[i], i);      // start 传 i\n\n// 不可重复选（40 题）\nif (i > start && candidates[i] == candidates[i-1]) continue;  // 同层去重\nbacktrack(candidates, target - candidates[i], i + 1);         // start 传 i+1',
    tips: '口诀：「可重复」start 传 i，「不可重复」start 传 i+1 且同层去重。',
    createdAt: '2026-08-01T15:00:00'
  },
  {
    id: 12,
    title: '快慢指针 vs 对撞指针',
    category: '双指针',
    confusion: '双指针有「快慢」和「对撞」两种经典形态，分别用在什么场景？',
    difference: '快慢指针：同向运动、速度不同（slow 每次 1 步，fast 每次 2 步）。\n用途：判环、找链表/数组中点、原地去重、滑动窗口。\n\n对撞指针：分别从头尾出发、向中间靠拢（left 从 0，right 从末尾）。\n用途：有序数组两数之和、判断回文、盛水容器、反转数组。\n\n判断标准：\n- 有「环 / 中点 / 窗口」→ 快慢\n- 有序 / 回文 / 求面积 → 对撞',
    example: '',
    tips: '记住两个代表题：快慢 → 环形链表（141）；对撞 → 盛水容器（11）。',
    createdAt: '2026-08-01T15:00:00'
  },
  {
    id: 13,
    title: '环形链表 vs 相交链表',
    category: '链表',
    confusion: '141 判环和 160 判相交都用双指针，解法一样吗？',
    difference: '判环（141）：快慢指针不同速，fast 每次 2 步 slow 每次 1 步，相遇即存在环。\n判相交（160）：两个指针同速，pA 走完 A 后切到 B 头、pB 走完 B 后切到 A 头，两指针走过相同总长度，相遇处即交点。\n\n本质区别：\n- 判环靠「速度差」让快指针追上慢指针\n- 判相交靠「路程相同」让两指针在交点碰头',
    example: '',
    tips: '环形看速度差，相交看路程和。两者都 O(1) 空间，但移动策略完全不同。',
    createdAt: '2026-08-01T15:00:00'
  },
  {
    id: 14,
    title: '盛水容器 vs 接雨水',
    category: '双指针',
    confusion: '11 题盛最多水的容器和 42 题接雨水，都是关于水的双指针题，有什么区别？',
    difference: '盛水容器：选「两条线」围成矩形，求最大面积。\n面积 = min(高[left], 高[right]) × (right-left)。每次移动较矮的一边（移动高边面积必不增）。\n\n接雨水：计算「中间凹地」能存多少水。\n每个位置存水 = min(该位置左边最高柱, 右边最高柱) - 当前高度。\n用双指针分别维护左右「当前最高柱」，低的那个决定当前列能存多少。\n\n一句话：盛水容器「围起来」，接雨水「凹进去」。',
    example: '',
    tips: '盛水移动「较矮边」，接雨水累计「左右最高取小 - 当前高」。别把两道题的面积公式搞混。',
    createdAt: '2026-08-01T15:00:00'
  },
  {
    id: 15,
    title: 'map vs unordered_map',
    category: 'STL 容器',
    confusion: 'map 和 unordered_map 都能存键值对，刷题时选哪个？',
    difference: 'map：基于红黑树，键自动有序，增删查 O(log n)。支持有序遍历、范围查询、lower_bound/upper_bound。\n\nunordered_map：基于哈希表，键无序，平均 O(1) 增删查。不支持有序遍历，但效率更高。\n\n刷题选择：\n- 只求「存在性 / 计数 / 下标映射」→ unordered_map（更快）\n- 需要「按键有序输出 / 找最近的大于小于」→ map\n- 自定义类型做 key：两者都需要提供比较或哈希函数',
    example: '',
    tips: '默认优先 unordered_map；需要「有序」才用 map。注意 unordered_map 最坏情况退化 O(n)，但竞赛/面试通常不卡。',
    createdAt: '2026-08-01T15:00:00'
  },
  {
    id: 16,
    title: '位运算：与 & / 或 | / 异或 ^ 的用途',
    category: '位运算',
    confusion: '三个位运算长得像，分别解决什么类型的问题？',
    difference: '与 &：两个位都为 1 才为 1。常用技巧：\n- x & 1 判断奇偶（取最低位）\n- x & (x-1) 去掉最低位的 1（数 1 的个数）\n- x & (-x) 取出最低位的 1（lowbit）\n\n或 |：有一个为 1 就为 1。常用：置位为 1、合并标志位。\n\n异或 ^：相同为 0 不同为 1。核心性质：a^a=0、a^0=a、交换律结合律。\n常用：消除成对元素找唯一（136 题）、汉明距离（461 题）。',
    example: '// 数二进制中 1 的个数（x & (x-1) 法）\nint count = 0;\nwhile (x) { x &= (x - 1); count++; }\n\n// 判断是否 2 的幂\nbool isPowerOfTwo = x > 0 && (x & (x - 1)) == 0;',
    tips: '记三句话：& 用来「取/清位」，| 用来「置位」，^ 用来「消成对找唯一」。',
    createdAt: '2026-08-01T15:00:00'
  },
  {
    id: 17,
    title: 'unordered_map: find() vs count() vs operator[]',
    category: 'STL 容器',
    confusion: '判断 key 是否存在，用 find() 还是 count()？operator[] 有什么坑？',
    difference: 'count()：返回 key 的出现次数（unordered_map 中要么 0 要么 1），只判断存在性。\nfind()：返回迭代器，找到后可访问 it->second，比 count() 更高效（一次查表拿到位置）。\noperator[]：如果 key 不存在，会「插入一个默认值」并返回引用——这是副作用！只用于「读取已知存在的 key」或「直接赋值」。\n\n推荐：\n- 只需判断存在 → count() 或 find() != end()\n- 需要访问值 → find()\n- 要累加/赋值 → operator[]（如 freq[num]++）',
    example: '// 推荐：判断 + 取值\nauto it = mp.find(key);\nif (it != mp.end()) return it->second;\n\n// 不推荐：会插入默认值\nif (mp[key] > 0) { ... }  // key 不存在时 mp[key] 会创建它',
    tips: '记法：count 问「有没有」，find 问「在哪」，operator[] 是「没有就造一个」。',
    createdAt: '2026-08-01T15:00:00'
  },
  {
    id: 18,
    title: '翻转二叉树 vs 反转链表',
    category: '数据结构',
    confusion: '226 翻转二叉树和 206 反转链表都叫「翻转/反转」，是同一类操作吗？',
    difference: '完全不是一回事：\n\n反转链表：改变节点之间 next 的指向方向，1→2→3 变 3→2→1。用三指针（prev/curr/next）逐个掉头。\n\n翻转二叉树：交换每个节点的左右子节点，得到镜像。用递归或队列逐节点交换左右子树。\n\n区别：\n- 链表反转是「线性结构方向翻转」\n- 二叉树翻转是「每个节点的左右子树交换」',
    example: '',
    tips: '看到「链表」反转 = 指针掉头；看到「二叉树」翻转 = 左右子树交换。',
    createdAt: '2026-08-01T15:00:00'
  },
  {
    id: 19,
    title: '普通二分 vs 旋转数组二分',
    category: '二分查找',
    confusion: '33 题旋转排序数组的二分，和普通二分查找代码差在哪？',
    difference: '普通二分：数组完全有序，直接比较 nums[mid] 与 target 决定去左还是去右。\n\n旋转数组二分：数组被「断点」分成两段各自有序。每次二分要先判断「哪一半是有序的」：\n- 若 nums[left] <= nums[mid]，左半 [left, mid] 有序\n- 否则右半 [mid, right] 有序\n然后判断 target 是否落在「有序的那一半」内，决定去哪半继续搜。\n\n核心多了一步：「定位有序区间」。',
    example: '// 旋转数组：先判断哪半有序\nif (nums[left] <= nums[mid]) {        // 左半有序\n    if (nums[left] <= target && target < nums[mid]) right = mid - 1;\n    else left = mid + 1;\n} else {                              // 右半有序\n    if (nums[mid] < target && target <= nums[right]) left = mid + 1;\n    else right = mid - 1;\n}',
    tips: '旋转数组二分的口诀：先判「哪半有序」，再看 target 在不在有序半段里。',
    createdAt: '2026-08-01T15:00:00'
  },
  {
    id: 20,
    title: '两数之和 vs 三数之和',
    category: '双指针',
    confusion: '1 题两数之和用哈希表，15 题三数之和用排序+双指针，为什么解法不同？',
    difference: '两数之和：无序数组，返回下标，且只需一组答案。用哈希表 O(n)：遍历时查 target-num 是否出现过。\n\n三数之和：返回所有不重复组合。若用哈希表去重会很麻烦，改为「排序 + 固定一个 + 对撞双指针」，O(n²)，排序后天然便于去重。\n\n关键差异：\n- 两数之和要「下标」且不用去重 → 哈希表\n- 三数之和要「不重复组合」→ 排序 + 双指针\n\n（如果两数之和要求返回所有不重复组合，也应排序 + 双指针。）',
    example: '',
    tips: '要「下标」用哈希，要「不重复组合」就排序 + 双指针。',
    createdAt: '2026-08-01T15:00:00'
  },
  {
    id: 21,
    title: '二分找左边界 vs 找右边界',
    category: '二分查找',
    confusion: '34 题要同时找第一个和最后一个 target，左边界和右边界二分写法有什么不同？',
    difference: '找左边界（第一个 >= target）：\n- nums[mid] >= target 时 right = mid（收缩右边界，保留当前候选）\n- 否则 left = mid + 1\n- 用 while (left < right)，mid 取中偏左（向下取整）\n\n找右边界（最后一个 <= target）：\n- nums[mid] <= target 时 left = mid（收缩左边界）\n- 否则 right = mid - 1\n- 用 while (left < right)，mid 要取「中偏右」mid = (left + right + 1) / 2，否则 left=mid 时会死循环\n\n记忆：收缩哪个边界，mid 就往反方向取整。',
    example: '// 左边界（第一个 >= target）\nwhile (left < right) {\n    int mid = left + (right - left) / 2;       // 中偏左\n    if (nums[mid] >= target) right = mid;\n    else left = mid + 1;\n}\n\n// 右边界（最后一个 <= target）\nwhile (left < right) {\n    int mid = left + (right - left + 1) / 2;   // 中偏右，防死循环\n    if (nums[mid] <= target) left = mid;\n    else right = mid - 1;\n}',
    tips: '口诀：找左边界 mid 中偏左，找右边界 mid 中偏右；用 left=mid 时记得向上取整防死循环。',
    createdAt: '2026-08-01T15:00:00'
  },
  {
    id: 22,
    title: '范围 for 循环：值拷贝 vs auto vs auto&',
    category: 'C++ 语法',
    confusion: '遍历容器时 for (string s : strs)、for (auto key : map)、for (auto &key : map) 三种写法，区别在哪？哪个会修改原容器？',
    difference: '1. for (string s : strs)：\n   每次迭代把元素「值拷贝」到 s，s 是副本。\n   - 修改 s 不影响原容器\n   - 开销大：每个元素都要拷贝（对 string/vector 这种类型尤其明显）\n\n2. for (auto key : map)：\n   auto 自动推导，但仍是「值拷贝」整个元素。\n   - map 的元素类型是 pair<const Key, T>，auto 拷贝出的 key 里键仍是 const（不能改）\n   - 修改 key.second 只影响拷贝，不影响原 map\n   - 同样有拷贝开销\n\n3. for (auto &key : map)：\n   auto& 是「引用」，不拷贝，直接绑定到容器里的元素。\n   - 修改 key.second 会真正修改原 map\n   - 零拷贝开销，性能最好\n   - 注意：引用遍历时不要在循环内删除/插入元素（迭代器失效）\n\n选择建议：\n- 只读遍历 → 用 const auto&（既避免拷贝又防止误改）\n- 需要修改元素 → 用 auto&\n- 确实需要副本 → 才用 auto',
    example: '// 只读遍历：const 引用，最快且安全\nfor (const auto& p : mp) {\n    cout << p.first << p.second;\n}\n\n// 需要修改 value：引用\nfor (auto& p : mp) {\n    p.second++;   // 真正修改原 map\n}\n\n// 值拷贝：修改不影响原容器\nfor (auto p : mp) {\n    p.second++;   // 只改了拷贝\n}',
    tips: '口诀：遍历用 const auto&（只读）、auto&（改原值），默认别用 auto 值拷贝——又慢又可能改错地方。map 的键永远是 const，用 auto& 也只能改 second。',
    createdAt: '2026-08-01T18:00:00'
  },
  {
    id: 23,
    title: '什么时候用 DP？vs 贪心 / 回溯 / 分治',
    category: '算法思想',
    confusion: '拿到一道题，怎么判断该用动态规划、贪心、回溯还是分治？四者都涉及「分解子问题」，区别在哪？',
    difference: '四个方法都「把大问题拆小」，但拆的方式和目的不同：\n\n1. 动态规划（DP）：子问题重叠、会重复计算\n   - 问「方案数 / 最大最小 / 是否可行」且能递推 → DP\n   - 例：爬楼梯、不同路径、最长递增子序列\n\n2. 贪心：每步做局部最优，能证明局部最优 = 全局最优\n   - 比 DP 更简单更快（O(n) vs O(n²)），但难证明\n   - 例：跳跃游戏、买卖股票（单次）、找零（特定面额）\n   - 判断：这一步选最优，之后不需要回头重新选？\n\n3. 回溯：要「穷举所有方案本身」（不是数量），带撤销选择\n   - 例：全排列、组合总和、N 皇后\n   - 判断：题目要求「返回所有可能的具体组合/排列」？\n\n4. 分治：子问题相互独立，不重叠，各算各的再合并\n   - 例：归并排序、快速排序、最大子数组和（分治版）\n   - 判断：左右两半能独立求解，结果直接拼起来？\n\n快速判断口诀：\n- 只要数量/最优值，子问题会重复 → DP\n- 只要最优值，且能证明局部最优 → 贪心\n- 要枚举所有具体方案 → 回溯\n- 左右独立、天然递归合并 → 分治\n\nDP vs 贪心最容易混：两者都求最优值。区别是贪心「做选择后不回头」，DP「比较所有子问题结果取最优」。拿不准时先写 DP 保底，能证明贪心再优化。',
    example: '// 同是「最大子数组和」（53 题）\n// 贪心（Kadane）：只保留当前最优\nint cur = 0, best = INT_MIN;\nfor (int x : nums) { cur = max(x, cur + x); best = max(best, cur); }\n\n// DP：dp[i] 表示以 i 结尾的最大子数组和\nvector<int> dp(nums.size());\ndp[0] = nums[0];\nfor (int i = 1; i < nums.size(); i++) dp[i] = max(nums[i], dp[i-1] + nums[i]);',
    tips: '拿到题先问三个问题：① 要「数量/最优值」还是「具体方案」？② 子问题会重复算吗？③ 这一步选了最优还需要回头吗？答案组合起来就能确定用 DP/贪心/回溯/分治。',
    createdAt: '2026-08-01T19:00:00'
  },
  {
    id: 24,
    title: '组合 vs 排列：回溯时什么时候传 startIndex？',
    category: '回溯',
    confusion: '写回溯时，有的题递归传 start，有的题从 0 开始 + used 数组，到底怎么判断？组合和排列的模板差别在哪？',
    difference: '核心判断标准：答案对「顺序」敏感吗？\n\n1. 组合（顺序无关）：[1,2] 和 [2,1] 是同一个答案\n   → 用 start 参数，保证「只往前看、不回头」\n   → 例：组合总和（39/40）、组合（77）、子集（78）\n\n2. 排列（顺序有关）：[1,2] 和 [2,1] 是两个不同答案\n   → 每层都从下标 0 开始，用 used 数组标记「当前路径已用过的元素」\n   → 例：全排列（46/47）\n\nstart 具体从哪开始（组合内部也分情况）：\n- 元素可重复选（39 组合总和）→ 递归传 start = i\n- 元素不可重复选（40/77）→ 递归传 start = i+1\n- 子集（78）→ start = i+1，且每个节点都记录\n\n一句话记忆：\n- 顺序无关 → 用 start（避免回头产生重复）\n- 顺序有关 → 从 0 + used（每层都要尝试所有元素，但要防重复选同一位置）\n\n对比模板：\n- 组合：for (int i = start; i < n; i++) { 选; backtrack(i 或 i+1); 撤; }\n- 排列：for (int i = 0; i < n; i++) { if (used[i]) continue; used[i]=true; 选; backtrack(); 撤; used[i]=false; }',
    example: '// 组合（不可重复选）：用 start，传 i+1\nvoid backtrack(vector<int>& nums, int start) {\n    for (int i = start; i < nums.size(); i++) {\n        path.push_back(nums[i]);\n        backtrack(nums, i + 1);   // start 传 i+1\n        path.pop_back();\n    }\n}\n\n// 排列：从 0 开始 + used 数组\nvoid backtrack(vector<int>& nums) {\n    if (path.size() == nums.size()) { res.push_back(path); return; }\n    for (int i = 0; i < nums.size(); i++) {\n        if (used[i]) continue;    // 已用过的位置跳过\n        used[i] = true;\n        path.push_back(nums[i]);\n        backtrack(nums);\n        path.pop_back();\n        used[i] = false;\n    }\n}',
    tips: '口诀：组合「顺序无关」用 start 不回头；排列「顺序有关」从 0 + used 防重位。再看元素能否重复选，决定 start 传 i 还是 i+1。',
    createdAt: '2026-08-02T11:00:00'
  },
  {
    id: 25,
    title: '单调栈 vs 单调队列',
    category: '技巧',
    confusion: '单调栈和单调队列都维护单调性、都是均摊 O(n)，什么时候用哪个？',
    difference: '单调栈：只有一端（栈顶）进出。元素一旦入栈，除非被更强的后来者顶掉，否则一直在。\n用途：找「每个元素右边第一个更大/更小」（无时效性，答案在未来的某个元素出现时揭晓）。\n代表题：739 每日温度、84 柱状图最大矩形。\n\n单调队列：双端都可操作——队尾清理 + 队首过期弹出。\n用途：固定大小滑动的窗口最值（元素有「保质期」，滑出窗口要失效）。\n代表题：239 滑动窗口最大值。\n\n一句话：有「窗口左边界移动」用队列，没有时效只有「等下一个更大」用栈。',
    example: '// 单调栈：739 每日温度（找右边第一个更大）\nfor (int i = 0; i < n; i++) {\n    while (!st.empty() && t[i] > t[st.top()]) {\n        res[st.top()] = i - st.top(); st.pop();\n    }\n    st.push(i);\n}\n\n// 单调队列：239 滑动窗口最大值（队首会过期）\ndq.push_back(0);\nfor (int i = 1; i < n; i++) {\n    if (dq.front() <= i - k) dq.pop_front();   // 队首滑出窗口\n    while (!dq.empty() && nums[i] >= nums[dq.back()]) dq.pop_back();\n    dq.push_back(i);\n    if (i >= k - 1) res[i-k+1] = nums[dq.front()];\n}',
    tips: '口诀：窗口滑动看队列，只等更大用栈。单调队列 = 单调栈 + 队首过期弹出。',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 26,
    title: '0-1 背包 vs 完全背包',
    category: '动态规划',
    confusion: '两者都是「选物品凑容量」，一维滚动数组一个倒序一个正序，为什么枚举方向决定物品能否重复选？',
    difference: '关键在 dp[j - w] 读取的是「本轮」还是「上一轮」的值：\n\n倒序（0-1 背包）：j 从大到小，更新 dp[j] 时 dp[j-w] 还没被本轮物品 i 更新过，读到的是上一轮（不含物品 i）的值——每个物品至多用一次。\n\n正序（完全背包）：j 从小到大，更新 dp[j] 时 dp[j-w] 已经被本轮更新过（可能已包含物品 i），相当于「先选一次 i 后还能再选」——物品可无限重复。\n\n记忆：倒序是「先看大格子，小格子还是旧值」；正序是「小格子已刷新，新值接着用」。',
    example: '// 0-1 背包（416 分割等和子集）：倒序\nfor (int i = 0; i < n; i++)\n    for (int j = target; j >= nums[i]; j--)\n        dp[j] = dp[j] || dp[j - nums[i]];\n\n// 完全背包（322 零钱兑换）：正序\nfor (int coin : coins)\n    for (int j = coin; j <= amount; j++)\n        dp[j] = min(dp[j], dp[j - coin] + 1);',
    tips: '判断题属于哪种：看「每个元素能否重复使用」——目标和/分割等和子集每个数只用一次（0-1），零钱兑换/完全平方数面额无限（完全）。方向写反，两题互换出错。',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 27,
    title: '零钱兑换(322) vs 目标和(494)：同为背包求的是什么？',
    category: '动态规划',
    confusion: '322 和 494 都可以套背包模型，为什么 dp 的「运算」一个是 min 一个是加法？',
    difference: '零钱兑换（322）：求凑出 amount 的「最少硬币数」。\ndp[a] = min(dp[a-coin] + 1)，初始 dp[0]=0、其余无穷大。op 是 min，是「最值型」背包。\n完全背包（硬币可重复），正序枚举。\n\n目标和（494）：求添加正负号后等于 target 的「方案数」。\n先转化为：选负号集合之和 neg = (sum-target)/2，求「和恰好为 neg 的子集个数」。\ndp[j] += dp[j - nums[i]]，初始 dp[0]=1（空集方案）。op 是加法，是「计数型」背包。\n0-1 背包（每个数只用一次），倒序枚举。\n\n一句话：问「最少/最多几件」用 min/max；问「有多少种选法」用加法且 dp[0]=1。',
    example: '// 322：最值型（min）\nvector<int> dp(amount + 1, amount + 2); dp[0] = 0;\nfor (int coin : coins)\n    for (int j = coin; j <= amount; j++)\n        dp[j] = min(dp[j], dp[j - coin] + 1);\n\n// 494：计数型（+），0-1 背包倒序\nint neg = (sum - target) / 2;\nvector<int> dp(neg + 1); dp[0] = 1;\nfor (int x : nums)\n    for (int j = neg; j >= x; j--)\n        dp[j] += dp[j - x];',
    tips: '计数型背包的初始 dp[0]=1 不可少（什么都不选是一种方案）；最值型初始 dp[0]=0、其余为无穷大。运算类型由问题类型决定：最值→min/max，计数→加法，可行→or。',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 28,
    title: '前缀和+哈希 vs 滑动窗口：都求「和为 k 的子数组」，用哪个？',
    category: '数组技巧',
    confusion: '求和为 k 的子数组时，有的题用滑动窗口，560 题却必须前缀和+哈希，判断标准是什么？',
    difference: '判断标准只有一个：数组元素是否全为非负。\n\n滑动窗口依赖单调性：窗口右扩和变大、左缩和变小，只有元素全非负才成立。适合「求最长的和为 k 窗口」或「和不小于 k 的最短窗口」。\n\n前缀和+哈希不依赖单调性：任意子数组和 = 两个前缀和之差，正负都无所谓。适合「计数/存在性」问题——数有多少个子数组和为 k。\n\n注意方向：560 问「个数」，即使元素全非负，滑动窗口也不能直接数（和为 k 的起点可能有多个，窗口只能定位一个），仍需前缀和+哈希。',
    example: 'unordered_map<long, int> cnt; cnt[0] = 1;   // 空前缀\nlong cur = 0; int ans = 0;\nfor (int x : nums) {\n    cur += x;\n    if (cnt.count(cur - k)) ans += cnt[cur - k];  // 先查\n    cnt[cur]++;                                    // 再插\n}',
    tips: '三步判断：① 元素有负数 → 只能前缀和；② 问「个数/存在」→ 前缀和+哈希；③ 全非负且问「最长/最短」→ 滑动窗口。',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 29,
    title: '最小覆盖子串(76) vs 找所有字母异位词(438)：两种滑动窗口长什么样？',
    category: '滑动窗口',
    confusion: '76 和 438 都是字符串滑动窗口，为什么 76 的窗口大小可变、438 的窗口是定长的？',
    difference: '438（找异位词）：目标窗口长度固定 = p 的长度。\n写法：右端进字符，窗口超长左端收，长度恰好时比较频次（window == need）。「定长窗口」。\n\n76（最小覆盖）：窗口要「包含 t 的全部字符（含次数）」且越短越好。\n写法：右端扩张直到覆盖成立，然后左端收缩到「刚好不覆盖」为止，收缩中记录最短。「可变窗口 + 双向移动」。\n\n模板区分：\n- 定长窗口：右端每走一步，左端最多收一步，长度恒定\n- 可变窗口：先扩到满足，再收到不满足，交替推进\n\n共同技巧：用「欠账计数 count」代替每步 O(128) 的表比较。',
    example: '// 76 可变窗口：先扩后收\nwhile (right < n) {\n    // ... 扩张，count==0 表示已覆盖\n    while (count == 0) {\n        // 记录最短，然后左收破坏覆盖\n    }\n}\n\n// 438 定长窗口：长度超了就收\nif (right - left + 1 > plen) { /* 左收 */ }\nif (right - left + 1 == plen && window == need) res.push_back(left);',
    tips: '先问「窗口长度是否固定」：固定→定长模板；不固定→「扩张到满足、收缩到破坏」模板。两题都要用 need/count 计数代替整表比较。',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 30,
    title: '岛屿数量：DFS vs BFS vs 并查集',
    category: '搜索',
    confusion: '200 岛屿数量三种解法都能做，面试该写哪个？差别在哪？',
    difference: 'DFS（最短代码）：遇到 \'1\' 计数+1，递归淹没自身和四邻。递归深度最坏 O(nm)，300×300 全 \'1\' 时可能爆栈（力扣数据通常能过）。\n\nBFS（最稳）：遇到 \'1\' 计数+1，队列扩散淹没。无爆栈风险，注意「入队时立即标记」，否则重复入队。\n\n并查集（最通用）：\'1\' 格子与右/下 \'1\' 邻居合并，答案 = 初始 \'1\' 个数 - 成功合并次数（或统计不同根数量）。代码最长，但可推广到「动态加陆地」的 305 题变体。\n\n选择建议：面试先写 DFS（快、清晰），主动提一句「极端数据会爆栈，可换 BFS」加分；动态加点的变体再上并查集。',
    example: '// DFS 版核心\nvoid dfs(vector<vector<char>>& g, int i, int j) {\n    if (i < 0 || i >= m || j < 0 || j >= n || g[i][j] != \'1\') return;\n    g[i][j] = \'0\';                 // 淹没\n    dfs(g, i+1, j); dfs(g, i-1, j);\n    dfs(g, i, j+1); dfs(g, i, j-1);\n}',
    tips: '口诀：静态求个数 DFS/BFS 均可（优先短代码），动态加点用并查集。无论哪种，标记（淹没/visited）必须在「访问/入队时」立刻做。',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 31,
    title: 'LIS 两种解法：O(n²) DP vs O(n log n) 贪心+二分',
    category: '动态规划',
    confusion: '300 最长递增子序列两个经典复杂度，tails 数组到底存的是什么？为什么二分是对的？',
    difference: 'O(n²) DP：dp[i] = 以 nums[i] 结尾的 LIS 长度，枚举所有 j<i 且 nums[j]<nums[i] 转移。直观、能顺便求出具体序列。\n\nO(n log n) 贪心+二分：tails[k] = 「长度为 k+1 的所有递增子序列中，最小的结尾值」。\n- 新元素大于 tails 末尾 → LIS 变长，追加\n- 否则二分找「第一个 >= x 的位置」替换——同长度下结尾更小，后面更容易接上\n\ntails 一定是（严格）递增的：长度更长的序列结尾必然更大（反证：若 tails[i] >= tails[j] 且 i<j，把长序列砍短反而结尾更小，矛盾）——这保证二分合法。\n\n注意：tails 不是原数组的某个真实子序列，只能求长度；要输出方案需额外记录每个元素插入时的前驱。',
    example: 'vector<int> tails;\nfor (int x : nums) {\n    auto it = lower_bound(tails.begin(), tails.end(), x);  // 严格递增用 lower_bound\n    if (it == tails.end()) tails.push_back(x);             // 变长\n    else *it = x;                                          // 同长度换更小结尾\n}\nreturn tails.size();',
    tips: '严格递增用 lower_bound（找第一个 >= x），非严格递增（允许相等）用 upper_bound。换错会得到「最长不减子序列」/「最长严格递增子序列」互串。',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 32,
    title: '第 K 大：堆 vs 快速选择',
    category: '排序选择',
    confusion: '215 求第 k 大，堆 O(n log k) 和快选期望 O(n) 该用哪个？',
    difference: '堆解法：\n- 维护大小为 k 的小顶堆，遍历一遍，堆顶即答案\n- 稳定 O(n log k)、不改动原数组、天然支持「数据流/一次一个到达」的场景\n- k 很小时接近线性；k 接近 n 时退化到 O(n log n)\n\n快速选择：\n- partition 每次只递归目标所在的一侧，期望 O(n)\n- 需要整个数组一次性可用（随机访问），会打乱数组\n- 最坏 O(n²)，随机化 pivot 规避；三路划分应对大量重复值\n\n选择：静态数组 + 要理论最优 → 快速选择；数据流、k 小、或不想动原数组 → 堆。面试两个都写要点更好。',
    example: '// 堆：大小 k 的小顶堆\npriority_queue<int, vector<int>, greater<int>> pq;\nfor (int x : nums) {\n    pq.push(x);\n    if ((int)pq.size() > k) pq.pop();\n}\nreturn pq.top();\n\n// 快速选择：只递归一侧\nint partitionL(vector<int>& a, int l, int r);  // 降序划分\nint qs(vector<int>& a, int l, int r, int k) {\n    int p = partitionL(a, l, r);\n    if (p == k - 1) return a[p];\n    return p > k - 1 ? qs(a, l, p - 1, k) : qs(a, p + 1, r, k);\n}',
    tips: '记两个场景锚点：「Top-K 数据不断到来」只能堆（347 也常用堆）；「一次性数组第 k 大且要求 O(n)」用快选。第 k 大按降序 partition，别和第 k 小搞反。',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 33,
    title: '环形链表 I(141) vs II(142)：判环与找入环点',
    category: '链表',
    confusion: '两题都用快慢指针，142 比 141 多了哪一步？为什么「回头同速走」就能找到入环点？',
    difference: '141（判环）：fast 2 步 slow 1 步，相遇 → 有环；fast 到 nullptr → 无环。到此为止。\n\n142（找入环点）：在相遇后加一步——一个指针放回头节点，两指针都改为每次 1 步，再次相遇的节点即入环点。\n\n推导：设头到入环点 a、入环点到相遇点 b、相遇点绕回入环点 c。\n相遇时 fast 走了 slow 的两倍：a+b+k(b+c) = 2(a+b)，化简得 a = c + (k-1)(b+c)。\n含义：从头走 a 步 与 从相遇点走 c（再绕整圈）步 恰好在入环点会合。\n\n141 是 142 的子集；面试直接背 142 模板即可。',
    example: 'ListNode *slow = head, *fast = head;\nwhile (fast && fast->next) {\n    slow = slow->next; fast = fast->next->next;\n    if (slow == fast) {                      // 141 到此返回 true\n        ListNode *p = head;                  // 142 额外步骤\n        while (p != slow) { p = p->next; slow = slow->next; }\n        return p;                            // 入环点\n    }\n}\nreturn nullptr;',
    tips: '记口诀：「判环看速度差，入环点看路程等」。循环条件 fast && fast->next 防空指针；a=0（头即入环点）推导同样成立，无需特判。',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 34,
    title: '柱状图最大矩形(84) vs 最大矩形(85)',
    category: '单调栈',
    confusion: '84 和 85 都是「最大矩形」，85 怎么把二维问题变成 84？递增栈方向为什么和接雨水相反？',
    difference: '84：一维柱状图，直接单调栈。\n维护「高度递增」的栈：当前柱比栈顶矮时弹栈结算——弹出的栈顶柱高为矩形高，宽 = 当前下标 - 新栈顶 - 1（左右第一个更矮的位置夹出的宽度）。首尾加 0 哨兵清栈。\n\n85：01 矩阵。逐行把「向上的连续 1」压成本行柱状图高度（heights[j] 遇 0 归零、遇 1 +1），每行调用一次 84 的单调栈，取全局最大。85 = 逐行压缩 + 84。\n\n与接雨水对比：接雨水维护「递减栈」找两边更高的挡板；84 维护「递增栈」找两边更矮的边界。方向相反，因为一个找「更高」，一个找「更矮」。',
    example: '// 84 核心：递增栈 + 哨兵\nheights.push_back(0); heights.insert(heights.begin(), 0);\nstack<int> st;\nfor (int i = 0; i < heights.size(); i++) {\n    while (!st.empty() && heights[i] < heights[st.top()]) {\n        int h = heights[st.top()]; st.pop();\n        int w = i - st.top() - 1;\n        ans = max(ans, h * w);\n    }\n    st.push(i);\n}\n\n// 85 核心：逐行压高\nfor (int i = 0; i < m; i++) {\n    for (int j = 0; j < n; j++)\n        heights[j] = matrix[i][j] == \'1\' ? heights[j] + 1 : 0;\n    ans = max(ans, largestRectangleArea(heights));  // 复用 84\n}',
    tips: '85 的桥梁就一句话：「每行求一次柱状图最大矩形」。84 的宽度是 i - st.top() - 1（弹出后的新栈顶到当前下标之间），弹出后栈空时宽度为 i（左侧没有更矮柱）。',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 35,
    title: '打家劫舍(198/213) vs 打家劫舍 III(337)：线性 DP vs 树形 DP',
    category: '动态规划',
    confusion: '同样「相邻不能偷」，链上和树上的转移差在哪？树形版为什么不偷孩子反而可能更优？',
    difference: '198（链式）：dp[i] = max(dp[i-1]（不偷 i）, dp[i-2]+nums[i]（偷 i））。\n两个状态滚动即可，转移看「前两家」。\n\n337（树形）：每个节点返回二元组 {rob, skip}：\n- rob = val + left.skip + right.skip（偷根，孩子必不偷）\n- skip = max(left.rob, left.skip) + max(right.rob, right.skip)（不偷根，孩子各选最优）\n\n关键差异在 skip：不偷当前节点时孩子「可偷可不偷」，要取 max 而不是强制偷——写成 left.rob 会丢解（孩子不偷可能更优，例如孙子的值很大）。\n\n后序遍历（先子后父）是树形 DP 的标志：父的状态由孩子的两个状态组合而来。',
    example: 'pair<int,int> dfs(TreeNode* node) {   // {偷该节点, 不偷该节点}\n    if (!node) return {0, 0};\n    auto [lrob, lskip] = dfs(node->left);\n    auto [rrob, rskip] = dfs(node->right);\n    int rob  = node->val + lskip + rskip;\n    int skip = max(lrob, lskip) + max(rrob, rskip);\n    return {rob, skip};\n}\n// 答案 = max(dfs(root))',
    tips: '口诀：链式看「前一家」，树形看「两个孩子」。树形 DP 模板三件套：后序遍历 + 每节点返回状态元组 + 空节点返回全零状态。',
    createdAt: '2026-09-02T10:00:00'
  },
  {
    id: 36,
    title: '二叉树最大路径和(124) vs 二叉树直径(543)',
    category: '二叉树',
    confusion: '两题都是「任意两节点间最长路径」，124 为什么不能像 543 那样直接左加右？',
    difference: '543（直径，无权）：路径长度按「边数」计，所有边权都是 1。\n递归返回子树高度 max(左,右)+1，全局更新 max(左高+右高)。高度最少是 0，无需处理负数。\n\n124（带权，可负）：路径和按「节点值」计，节点值可为负。\n三个不同点：\n1. 负贡献要砍掉：gain = max(dfs(child), 0)——子路径为负不如不要\n2. 答案初值 INT_MIN：全负树（单节点 -3）答案就是负数，不能初始化成 0\n3. 结算与返回分离：在当前节点结算「左增益+根+右增益」（路径可在此拐弯），但向父返回只能「根+max(左增益,右增益)」（拐过弯的路径不能再向上延伸）\n\n框架完全同构：递归函数返回「向上贡献」，用全局变量在「每个节点」处更新完整路径最优。',
    example: 'int ans = INT_MIN;\nint gain(TreeNode* node) {              // 以 node 向下单边最大贡献\n    if (!node) return 0;\n    int l = max(gain(node->left), 0);   // 负贡献砍掉\n    int r = max(gain(node->right), 0);\n    ans = max(ans, node->val + l + r);  // 拐弯路径在此结算\n    return node->val + max(l, r);       // 向上只能单边\n}',
    tips: '对比记忆：543 = 左高 + 右高（边数、非负）；124 = 左增益 + 根值 + 右增益（带权、可负要砍）。两题共用「返回单边、全局结算」骨架，是二叉树路径题的万能模板。',
    createdAt: '2026-09-02T10:00:00'
  },
];

// ===================================================================
// 初始化
// ===================================================================
function init() {
  // 版本检测：如果 localStorage 数据版本低于当前版本，用默认数据覆盖
  const storedVersion = parseInt(localStorage.getItem(VERSION_KEY)) || 0;
  const versionMatch = storedVersion >= DATA_VERSION;

  const savedProblems = localStorage.getItem(PROB_STORAGE_KEY);
  if (savedProblems && versionMatch) {
    try { problems = JSON.parse(savedProblems); } catch { problems = []; }
  }
  if (problems.length === 0) {
    problems = JSON.parse(JSON.stringify(DEFAULT_PROBLEMS));
    saveProblems();
  }

  const savedKnowledge = localStorage.getItem(KNOW_STORAGE_KEY);
  if (savedKnowledge && versionMatch) {
    try { knowledge = JSON.parse(savedKnowledge); } catch { knowledge = []; }
  }
  if (knowledge.length === 0) {
    knowledge = JSON.parse(JSON.stringify(DEFAULT_KNOWLEDGE));
    saveKnowledge();
  }

  const savedConfusions = localStorage.getItem(CONFUSION_STORAGE_KEY);
  if (savedConfusions && versionMatch) {
    try { confusions = JSON.parse(savedConfusions); } catch { confusions = []; }
  }
  if (confusions.length === 0) {
    confusions = JSON.parse(JSON.stringify(DEFAULT_CONFUSIONS));
    saveConfusions();
  }

  // 刷新版本号
  localStorage.setItem(VERSION_KEY, DATA_VERSION.toString());
  renderCards();
}

function saveProblems() { localStorage.setItem(PROB_STORAGE_KEY, JSON.stringify(problems)); }
function saveKnowledge() { localStorage.setItem(KNOW_STORAGE_KEY, JSON.stringify(knowledge)); }
function saveConfusions() { localStorage.setItem(CONFUSION_STORAGE_KEY, JSON.stringify(confusions)); }

// ===================================================================
// 工具函数
// ===================================================================
function escapeHtml(str) {
  if (!str) return '';
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function showToast(msg, type) {
  const c = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = 'toast' + (type === 'success' ? ' success' : type === 'error' ? ' error' : '');
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => { if (t.parentNode) t.remove(); }, 2500);
}

function downloadJSON(data, prefix) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${prefix}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// ===================================================================
// 题目渲染
// ===================================================================
function renderCards() {
  const query = document.getElementById('searchInput').value.trim().toLowerCase();
  const diffFilter = document.getElementById('filterDifficulty').value;
  const sort = document.getElementById('filterSort').value;

  let filtered = problems.filter(p => {
    if (diffFilter && p.difficulty !== diffFilter) return false;
    if (query) {
      const s = `${p.number} ${p.title} ${p.titleEn || ''} ${p.knowledge.join(' ')}`.toLowerCase();
      if (!s.includes(query)) return false;
    }
    return true;
  });

  switch (sort) {
    case 'difficulty': filtered.sort((a, b) => {
      const w = { '简单': 0, '中等': 1, '困难': 2 };
      return (w[a.difficulty] - w[b.difficulty]) || (a.number - b.number);
    }); break;
    case 'number-asc': filtered.sort((a, b) => a.number - b.number); break;
    case 'number-desc': filtered.sort((a, b) => b.number - a.number); break;
    case 'title': filtered.sort((a, b) => (a.title || '').localeCompare(b.title || '', 'zh')); break;
    case 'newest': filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
  }

  const grid = document.getElementById('cardGrid');
  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📋</div>
        <h3>${problems.length === 0 ? '还没有题目记录' : '没有匹配的题目'}</h3>
        <p>${problems.length === 0 ? '点击「添加题目」开始记录吧！' : '试试调整搜索条件'}</p>
      </div>`;
  } else {
    grid.innerHTML = filtered.map(p => renderCard(p)).join('');
  }
  updateStats();
}

function renderCard(p) {
  const dk = p.difficulty === '简单' ? 'easy' : p.difficulty === '中等' ? 'medium' : 'hard';
  const tagsHtml = p.knowledge.map(k =>
    `<span class="tag" onclick="event.stopPropagation();openKnowledgeTopic('${escapeHtml(k)}')">${escapeHtml(k)}</span>`
  ).join('');
  return `<div class="card ${dk}" onclick="openDetail(${p.id})">
    <div class="card-top">
      <span class="card-number">#${p.number}</span>
      <span class="difficulty difficulty-${dk}">${p.difficulty}</span>
    </div>
    <div class="card-title">${escapeHtml(p.title)}</div>
    ${p.titleEn ? `<div class="card-title-en">${escapeHtml(p.titleEn)}</div>` : ''}
    <div class="card-tags">${tagsHtml}</div>
  </div>`;
}

function updateStats() {
  const total = problems.length;
  const easy = problems.filter(p => p.difficulty === '简单').length;
  const medium = problems.filter(p => p.difficulty === '中等').length;
  const hard = problems.filter(p => p.difficulty === '困难').length;
  const pct = Math.min(100, Math.round((total / TOTAL_HOT100) * 100));

  document.getElementById('statTotal').textContent = total;
  document.getElementById('countEasy').textContent = easy;
  document.getElementById('countMedium').textContent = medium;
  document.getElementById('countHard').textContent = hard;
  document.getElementById('progressPct').textContent = pct + '%';

  const circumference = 2 * Math.PI * 34;
  const offset = circumference - (pct / 100) * circumference;
  const ring = document.getElementById('progressRing');
  ring.style.strokeDasharray = circumference;
  ring.style.strokeDashoffset = offset;

  document.getElementById('barEasy').style.width = (easy / TOTAL_HOT100 * 100) + '%';
  document.getElementById('barMedium').style.width = (medium / TOTAL_HOT100 * 100) + '%';
  document.getElementById('barHard').style.width = (hard / TOTAL_HOT100 * 100) + '%';
}

// ===================================================================
// 题目 CRUD
// ===================================================================
function openAddModal() {
  probEditingId = null;
  document.getElementById('formModalTitle').textContent = '添加题目';
  ['inputNumber', 'inputTitle', 'inputTitleEn', 'inputKnowledge', 'inputSolution', 'inputDifficulties']
    .forEach(id => document.getElementById(id).value = '');
  document.getElementById('inputDifficulty').value = '中等';
  document.getElementById('formModal').classList.add('active');
  setTimeout(() => document.getElementById('inputNumber').focus(), 100);
}

function openEditModal(id) {
  const p = problems.find(x => x.id === id);
  if (!p) return;
  probEditingId = id;
  document.getElementById('formModalTitle').textContent = '编辑题目';
  document.getElementById('inputNumber').value = p.number;
  document.getElementById('inputTitle').value = p.title;
  document.getElementById('inputTitleEn').value = p.titleEn || '';
  document.getElementById('inputDifficulty').value = p.difficulty;
  document.getElementById('inputKnowledge').value = p.knowledge.join(', ');
  document.getElementById('inputSolution').value = p.solution;
  document.getElementById('inputDifficulties').value = p.keyDifficulties || '';
  document.getElementById('formModal').classList.add('active');
}

function closeFormModal() {
  document.getElementById('formModal').classList.remove('active');
  probEditingId = null;
}

function saveProblem() {
  const number = parseInt(document.getElementById('inputNumber').value);
  const title = document.getElementById('inputTitle').value.trim();
  const titleEn = document.getElementById('inputTitleEn').value.trim();
  const difficulty = document.getElementById('inputDifficulty').value;
  const knowledgeRaw = document.getElementById('inputKnowledge').value.trim();
  const solution = document.getElementById('inputSolution').value.trim();
  const keyDifficulties = document.getElementById('inputDifficulties').value.trim();

  if (!number || number < 1) { showToast('请输入有效的题号', 'error'); return; }
  if (!title) { showToast('请输入中文标题', 'error'); return; }
  if (!knowledgeRaw) { showToast('请输入涉及知识点', 'error'); return; }
  if (!solution) { showToast('请输入解题思路', 'error'); return; }

  const knowledge = knowledgeRaw.split(/[,，、]/).map(s => s.trim()).filter(Boolean);

  if (probEditingId) {
    const idx = problems.findIndex(x => x.id === probEditingId);
    if (idx !== -1) {
      problems[idx] = { ...problems[idx], number, title, titleEn, difficulty, knowledge, solution, keyDifficulties };
      showToast('✅ 题目已更新', 'success');
    }
  } else {
    const newId = problems.length === 0 ? 1 : Math.max(...problems.map(p => p.id)) + 1;
    problems.push({
      id: newId, number, title, titleEn, difficulty, knowledge, solution, keyDifficulties,
      createdAt: new Date().toISOString()
    });
    showToast('✅ 题目已添加', 'success');
  }
  saveProblems();
  closeFormModal();
  renderCards();
}

function openDetail(id) {
  const p = problems.find(x => x.id === id);
  if (!p) return;
  probDetailId = id;
  const dk = p.difficulty === '简单' ? 'easy' : p.difficulty === '中等' ? 'medium' : 'hard';
  const knowledgeHtml = p.knowledge.map(k =>
    `<span class="tag" onclick="closeDetailModal();openKnowledgeTopic('${escapeHtml(k)}')">${escapeHtml(k)}</span>`
  ).join('');

  document.getElementById('detailBody').innerHTML = `
    <div class="detail-header">
      <div class="dm-number">#${p.number}</div>
      <div class="dm-title">${escapeHtml(p.title)}</div>
      ${p.titleEn ? `<div class="dm-title-en">${escapeHtml(p.titleEn)}</div>` : ''}
      <span class="difficulty difficulty-${dk}" style="display:inline-block;margin-top:10px;">${p.difficulty}</span>
    </div>
    <div class="dm-section">
      <div class="dm-label">涉及知识点</div>
      <div class="dm-knowledge">${knowledgeHtml}</div>
    </div>
    <div class="dm-section">
      <div class="dm-label">解题思路</div>
      <div class="dm-content">${escapeHtml(p.solution)}</div>
    </div>
    ${p.keyDifficulties ? `<div class="dm-section">
      <div class="dm-label">关键难点</div>
      <div class="dm-content">${escapeHtml(p.keyDifficulties)}</div>
    </div>` : ''}`;

  document.getElementById('detailModal').classList.add('active');
}

function closeDetailModal() {
  document.getElementById('detailModal').classList.remove('active');
  probDetailId = null;
}

function editFromDetail() {
  if (probDetailId === null) return;
  closeDetailModal();
  openEditModal(probDetailId);
}

function deleteFromDetail() {
  if (probDetailId === null) return;
  const id = probDetailId;
  closeDetailModal();
  deleteProblem(id);
}

function deleteProblem(id) {
  const p = problems.find(x => x.id === id);
  if (!p) return;
  if (!confirm(`确认删除「#${p.number} ${p.title}」？`)) return;
  problems = problems.filter(x => x.id !== id);
  saveProblems();
  renderCards();
  showToast('🗑️ 题目已删除', 'success');
}

// ===================================================================
// 知识侧边栏
// ===================================================================
function openKnowledgePanel() {
  document.getElementById('knowledgeOverlay').classList.add('active');
  document.getElementById('knowledgePanel').classList.add('open');
  currentKnowledgeView = 'list';
  renderKnowledgeList();
}

function closeKnowledgePanel() {
  document.getElementById('knowledgeOverlay').classList.remove('active');
  document.getElementById('knowledgePanel').classList.remove('open');
}

function renderKnowledgeList() {
  currentKnowledgeView = 'list';
  document.getElementById('knowledgeBackBtn').classList.remove('show');
  document.getElementById('knowledgePanelTitle').textContent = '📚 知识库';

  const cats = [...new Set(knowledge.map(k => k.category || '其他'))].sort();
  const allListHtml = knowledge.map(k => {
    const probCount = problems.filter(p => p.knowledge.some(t => t.toLowerCase() === k.name.toLowerCase())).length;
    return `<div class="kl-list-item" onclick="showKnowledgeDetail(${k.id})">
      <div class="kli-icon">${k.name[0].toUpperCase()}</div>
      <div class="kli-info">
        <div class="kli-name">${escapeHtml(k.name)}</div>
        <div class="kli-summary">${escapeHtml(k.summary)}</div>
      </div>
      <span class="kli-cat">${escapeHtml(k.category || '其他')}</span>
      <span class="kli-count">${probCount}题</span>
    </div>`;
  }).join('');

  const catBtns = '<button class="kl-cat active" data-cat="all" onclick="filterKnowledgeList(this,\'all\')">全部</button>'
    + cats.map(c =>
      `<button class="kl-cat" data-cat="${escapeHtml(c)}" onclick="filterKnowledgeList(this,'${escapeHtml(c)}')">${escapeHtml(c)}</button>`
    ).join('');

  document.getElementById('knowledgePanelBody').innerHTML = `
    <div class="kl-search">
      <input type="text" id="klSearchInput" placeholder="搜索知识点..." oninput="filterKnowledgeListBySearch()">
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
      <div class="kl-categories" id="klCategories" style="margin:0;">${catBtns}</div>
      <button class="btn btn-primary btn-xs" onclick="openKnowledgeAddForm()">＋ 添加</button>
    </div>
    <div id="klList">
      ${knowledge.length
        ? allListHtml
        : '<div style="text-align:center;padding:40px 0;color:var(--gray-400);font-size:14px;">暂无知识点，点击右上角添加</div>'}
    </div>`;
}

function filterKnowledgeList(btn, cat) {
  document.querySelectorAll('.kl-cat').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.kl-list-item').forEach(item => {
    const catLabel = item.querySelector('.kli-cat');
    item.style.display = (cat === 'all' || (catLabel && catLabel.textContent.trim() === cat)) ? 'flex' : 'none';
  });
}

function filterKnowledgeListBySearch() {
  const q = document.getElementById('klSearchInput').value.trim().toLowerCase();
  document.querySelectorAll('.kl-list-item').forEach(item => {
    const name = item.querySelector('.kli-name').textContent.toLowerCase();
    const summary = item.querySelector('.kli-summary').textContent.toLowerCase();
    item.style.display = (!q || name.includes(q) || summary.includes(q)) ? 'flex' : 'none';
  });
}

function showKnowledgeDetail(id) {
  const k = knowledge.find(x => x.id === id);
  if (!k) return;
  currentKnowledgeView = 'detail';
  document.getElementById('knowledgeBackBtn').classList.add('show');
  document.getElementById('knowledgePanelTitle').textContent = escapeHtml(k.name);

  // 解析方法表
  let methodsHtml = '';
  if (k.methods && k.methods.trim()) {
    const rows = k.methods.split('\n').filter(r => r.trim());
    const rowHtml = rows.map(r => {
      const parts = r.split('|').map(s => s.trim());
      if (parts.length >= 3) {
        return `<tr><td class="mt-name">${escapeHtml(parts[0])}</td><td>${escapeHtml(parts[1])}</td><td class="mt-complexity">${escapeHtml(parts[2])}</td></tr>`;
      }
      return `<tr><td colspan="3">${escapeHtml(r)}</td></tr>`;
    }).join('');
    methodsHtml = `<div class="kd-section">
      <div class="kd-label">常用方法 / API</div>
      <table class="method-table"><thead><tr><th>方法</th><th>说明</th><th>复杂度</th></tr></thead><tbody>${rowHtml}</tbody></table>
    </div>`;
  }

  // 关联题目
  const related = problems.filter(p => p.knowledge.some(t => t.toLowerCase() === k.name.toLowerCase()));
  const relatedHtml = related.length ? `<div class="kd-section">
    <div class="kd-label">关联题目（${related.length}）</div>
    <div class="kd-related-problems">
      ${related.map(p => `<span class="rp-item" onclick="closeKnowledgePanel();openDetail(${p.id})">#${p.number} ${escapeHtml(p.title)}</span>`).join('')}
    </div>
  </div>` : '';

  document.getElementById('knowledgePanelBody').innerHTML = `
    <div class="kd-header">
      <div class="kd-name">${escapeHtml(k.name)}</div>
      <div class="kd-cat">${escapeHtml(k.category || '未分类')}</div>
      <div class="kd-summary">${escapeHtml(k.summary)}</div>
    </div>
    <div class="kd-section">
      <div class="kd-label">概念介绍</div>
      <div class="kd-content">${escapeHtml(k.content)}</div>
    </div>
    ${methodsHtml}
    ${k.tips ? `<div class="kd-section">
      <div class="kd-label">刷题技巧</div>
      <div class="kd-content">${escapeHtml(k.tips)}</div>
    </div>` : ''}
    ${relatedHtml}
    <div class="kd-actions">
      <button class="btn btn-secondary btn-xs" onclick="openKnowledgeEditForm(${k.id})">✏️ 编辑</button>
      <button class="btn btn-danger btn-xs" onclick="deleteKnowledge(${k.id})">🗑️ 删除</button>
    </div>`;
}

function openKnowledgeTopic(name) {
  const k = knowledge.find(x => x.name.toLowerCase() === name.toLowerCase());
  openKnowledgePanel();
  if (k) {
    showKnowledgeDetail(k.id);
  } else {
    renderKnowledgeList();
    document.getElementById('klSearchInput').value = name;
    filterKnowledgeListBySearch();
    showToast('知识点「' + name + '」暂未收录，可以手动添加', '');
  }
}

// ===================================================================
// 知识点 CRUD
// ===================================================================
function openKnowledgeAddForm() {
  knowledgeEditingId = null;
  document.getElementById('kfTitle').textContent = '添加知识点';
  ['kfName', 'kfCategory', 'kfSummary', 'kfContent', 'kfMethods', 'kfTips']
    .forEach(id => document.getElementById(id).value = '');
  document.getElementById('knowledgeFormModal').classList.add('active');
}

function openKnowledgeEditForm(id) {
  const k = knowledge.find(x => x.id === id);
  if (!k) return;
  knowledgeEditingId = id;
  document.getElementById('kfTitle').textContent = '编辑知识点';
  document.getElementById('kfName').value = k.name;
  document.getElementById('kfCategory').value = k.category || '';
  document.getElementById('kfSummary').value = k.summary || '';
  document.getElementById('kfContent').value = k.content || '';
  document.getElementById('kfMethods').value = k.methods || '';
  document.getElementById('kfTips').value = k.tips || '';
  document.getElementById('knowledgeFormModal').classList.add('active');
}

function closeKnowledgeForm() {
  document.getElementById('knowledgeFormModal').classList.remove('active');
  knowledgeEditingId = null;
}

function saveKnowledge() {
  const name = document.getElementById('kfName').value.trim();
  const category = document.getElementById('kfCategory').value.trim();
  const summary = document.getElementById('kfSummary').value.trim();
  const content = document.getElementById('kfContent').value.trim();
  const methods = document.getElementById('kfMethods').value.trim();
  const tips = document.getElementById('kfTips').value.trim();

  if (!name) { showToast('请输入知识点名称', 'error'); return; }
  if (!category) { showToast('请输入分类', 'error'); return; }
  if (!summary) { showToast('请输入一句话概括', 'error'); return; }
  if (!content) { showToast('请输入详细概念介绍', 'error'); return; }

  if (knowledgeEditingId) {
    const idx = knowledge.findIndex(x => x.id === knowledgeEditingId);
    if (idx !== -1) {
      knowledge[idx] = { ...knowledge[idx], name, category, summary, content, methods, tips };
      showToast('✅ 知识点已更新', 'success');
    }
  } else {
    const newId = knowledge.length === 0 ? 1 : Math.max(...knowledge.map(k => k.id)) + 1;
    knowledge.push({ id: newId, name, category, summary, content, methods, tips, createdAt: new Date().toISOString() });
    showToast('✅ 知识点已添加', 'success');
  }
  saveKnowledge();
  closeKnowledgeForm();
  if (currentKnowledgeView === 'list') renderKnowledgeList();
  else { const lastId = knowledgeEditingId || knowledge[knowledge.length - 1].id; showKnowledgeDetail(lastId); }
}

function deleteKnowledge(id) {
  const k = knowledge.find(x => x.id === id);
  if (!k) return;
  if (!confirm(`确认删除知识点「${k.name}」？`)) return;
  knowledge = knowledge.filter(x => x.id !== id);
  saveKnowledge();
  renderKnowledgeList();
  showToast('🗑️ 知识点已删除', 'success');
}

// ===================================================================
// 易混淆点面板
// ===================================================================
function openConfusionPanel() {
  document.getElementById('confusionOverlay').classList.add('active');
  document.getElementById('confusionPanel').classList.add('open');
  currentConfusionView = 'list';
  renderConfusionList();
}

function closeConfusionPanel() {
  document.getElementById('confusionOverlay').classList.remove('active');
  document.getElementById('confusionPanel').classList.remove('open');
}

function renderConfusionList() {
  currentConfusionView = 'list';
  document.getElementById('confusionBackBtn').classList.remove('show');
  document.getElementById('confusionPanelTitle').textContent = '⚠️ 易混淆点';

  const cats = [...new Set(confusions.map(c => c.category || '其他'))].sort();
  const listHtml = confusions.map(c => `
    <div class="cfl-item" onclick="showConfusionDetail(${c.id})">
      <div class="cfl-icon">!</div>
      <div class="cfl-info">
        <div class="cfl-title">${escapeHtml(c.title)}</div>
        <div class="cfl-preview">${escapeHtml(c.confusion || '').substring(0, 60)}</div>
      </div>
      <span class="cfl-cat">${escapeHtml(c.category || '其他')}</span>
    </div>
  `).join('');

  const catBtns = '<button class="kl-cat active" data-cat="all" onclick="filterConfusionList(this,\'all\')">全部</button>'
    + cats.map(c => `<button class="kl-cat" data-cat="${escapeHtml(c)}" onclick="filterConfusionList(this,'${escapeHtml(c)}')">${escapeHtml(c)}</button>`).join('');

  document.getElementById('confusionPanelBody').innerHTML = `
    <div class="kl-search">
      <input type="text" id="cflSearchInput" placeholder="搜索易混淆点..." oninput="filterConfusionListBySearch()">
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
      <div class="kl-categories" id="cflCategories" style="margin:0;">${catBtns}</div>
      <button class="btn btn-confusion btn-xs" onclick="openConfusionAddForm()">＋ 添加</button>
    </div>
    <div id="cflList">
      ${confusions.length ? listHtml : '<div style="text-align:center;padding:40px 0;color:var(--gray-400);font-size:14px;">暂无易混淆点，点击右上角添加</div>'}
    </div>`;
}

function filterConfusionList(btn, cat) {
  document.querySelectorAll('#cflCategories .kl-cat').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.cfl-item').forEach(item => {
    const catLabel = item.querySelector('.cfl-cat');
    item.style.display = (cat === 'all' || (catLabel && catLabel.textContent.trim() === cat)) ? 'flex' : 'none';
  });
}

function filterConfusionListBySearch() {
  const q = document.getElementById('cflSearchInput').value.trim().toLowerCase();
  document.querySelectorAll('.cfl-item').forEach(item => {
    const title = item.querySelector('.cfl-title').textContent.toLowerCase();
    const preview = item.querySelector('.cfl-preview').textContent.toLowerCase();
    item.style.display = (!q || title.includes(q) || preview.includes(q)) ? 'flex' : 'none';
  });
}

function showConfusionDetail(id) {
  const c = confusions.find(x => x.id === id);
  if (!c) return;
  currentConfusionView = 'detail';
  document.getElementById('confusionBackBtn').classList.add('show');
  document.getElementById('confusionPanelTitle').textContent = escapeHtml(c.category || '易混淆点');

  const exampleHtml = c.example ? `
    <div class="cfd-section">
      <div class="cfd-label">代码对比示例</div>
      <pre class="cfd-code">${escapeHtml(c.example)}</pre>
    </div>` : '';

  document.getElementById('confusionPanelBody').innerHTML = `
    <div class="cfd-header">
      <div class="cfd-title">${escapeHtml(c.title)}</div>
      <div class="cfd-cat">${escapeHtml(c.category || '未分类')}</div>
    </div>
    <div class="cfd-section">
      <div class="cfd-label">易混淆的内容</div>
      <div class="cfd-content confusion">${escapeHtml(c.confusion)}</div>
    </div>
    <div class="cfd-section">
      <div class="cfd-label">区别与理解</div>
      <div class="cfd-content difference">${escapeHtml(c.difference)}</div>
    </div>
    ${exampleHtml}
    ${c.tips ? `<div class="cfd-section">
      <div class="cfd-label">记忆口诀 / 注意事项</div>
      <div class="cfd-content">${escapeHtml(c.tips)}</div>
    </div>` : ''}
    <div class="kd-actions">
      <button class="btn btn-secondary btn-xs" onclick="openConfusionEditForm(${c.id})">✏️ 编辑</button>
      <button class="btn btn-danger btn-xs" onclick="deleteConfusion(${c.id})">🗑️ 删除</button>
    </div>`;
}

// ===================================================================
// 易混淆点 CRUD
// ===================================================================
function openConfusionAddForm() {
  confusionEditingId = null;
  document.getElementById('cfTitle').textContent = '添加易混淆点';
  ['cfTitleInput', 'cfCategory', 'cfConfusion', 'cfDifference', 'cfExample', 'cfTips']
    .forEach(id => document.getElementById(id).value = '');
  document.getElementById('confusionFormModal').classList.add('active');
}

function openConfusionEditForm(id) {
  const c = confusions.find(x => x.id === id);
  if (!c) return;
  confusionEditingId = id;
  document.getElementById('cfTitle').textContent = '编辑易混淆点';
  document.getElementById('cfTitleInput').value = c.title;
  document.getElementById('cfCategory').value = c.category || '';
  document.getElementById('cfConfusion').value = c.confusion || '';
  document.getElementById('cfDifference').value = c.difference || '';
  document.getElementById('cfExample').value = c.example || '';
  document.getElementById('cfTips').value = c.tips || '';
  document.getElementById('confusionFormModal').classList.add('active');
}

function closeConfusionForm() {
  document.getElementById('confusionFormModal').classList.remove('active');
  confusionEditingId = null;
}

function saveConfusion() {
  const title = document.getElementById('cfTitleInput').value.trim();
  const category = document.getElementById('cfCategory').value.trim();
  const confusion = document.getElementById('cfConfusion').value.trim();
  const difference = document.getElementById('cfDifference').value.trim();
  const example = document.getElementById('cfExample').value.trim();
  const tips = document.getElementById('cfTips').value.trim();

  if (!title) { showToast('请输入标题', 'error'); return; }
  if (!category) { showToast('请输入所属主题', 'error'); return; }
  if (!confusion) { showToast('请输入易混淆的内容', 'error'); return; }
  if (!difference) { showToast('请输入区别与理解', 'error'); return; }

  if (confusionEditingId) {
    const idx = confusions.findIndex(x => x.id === confusionEditingId);
    if (idx !== -1) {
      confusions[idx] = { ...confusions[idx], title, category, confusion, difference, example, tips };
      showToast('✅ 易混淆点已更新', 'success');
    }
  } else {
    const newId = confusions.length === 0 ? 1 : Math.max(...confusions.map(c => c.id)) + 1;
    confusions.push({ id: newId, title, category, confusion, difference, example, tips, createdAt: new Date().toISOString() });
    showToast('✅ 易混淆点已添加', 'success');
  }
  saveConfusions();
  closeConfusionForm();
  if (currentConfusionView === 'list') renderConfusionList();
  else { const lastId = confusionEditingId || confusions[confusions.length - 1].id; showConfusionDetail(lastId); }
}

function deleteConfusion(id) {
  const c = confusions.find(x => x.id === id);
  if (!c) return;
  if (!confirm(`确认删除「${c.title}」？`)) return;
  confusions = confusions.filter(x => x.id !== id);
  saveConfusions();
  renderConfusionList();
  showToast('🗑️ 易混淆点已删除', 'success');
}

// ===================================================================
// 导出 / 导入
// ===================================================================
function exportData() {
  if (!problems.length) { showToast('暂无题目数据可导出', 'error'); return; }
  downloadJSON(problems, `leetcode-hot100-problems-${new Date().toISOString().slice(0, 10)}`);
  closeDropdown();
  showToast('📤 题目数据已导出', 'success');
}

function exportKnowledgeData() {
  if (!knowledge.length) { showToast('暂无知识库数据可导出', 'error'); return; }
  downloadJSON(knowledge, `leetcode-knowledge-${new Date().toISOString().slice(0, 10)}`);
  closeDropdown();
  showToast('📤 知识库已导出', 'success');
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const d = JSON.parse(e.target.result);
      if (!Array.isArray(d)) throw Error();
      problems = d;
      saveProblems();
      renderCards();
      showToast(`📥 导入 ${d.length} 条题目`, 'success');
    } catch { showToast('❌ 文件格式无效', 'error'); }
  };
  reader.readAsText(file);
  event.target.value = '';
  closeDropdown();
}

function importKnowledgeData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const d = JSON.parse(e.target.result);
      if (!Array.isArray(d)) throw Error();
      knowledge = d;
      saveKnowledge();
      showToast(`📥 导入 ${d.length} 条知识点`, 'success');
    } catch { showToast('❌ 文件格式无效', 'error'); }
  };
  reader.readAsText(file);
  event.target.value = '';
  closeDropdown();
}

function exportConfusionData() {
  if (!confusions.length) { showToast('暂无易混淆点可导出', 'error'); return; }
  downloadJSON(confusions, `leetcode-confusions-${new Date().toISOString().slice(0, 10)}`);
  closeDropdown();
  showToast('📤 易混淆点已导出', 'success');
}

function importConfusionData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const d = JSON.parse(e.target.result);
      if (!Array.isArray(d)) throw Error();
      confusions = d;
      saveConfusions();
      showToast(`📥 导入 ${d.length} 条易混淆点`, 'success');
    } catch { showToast('❌ 文件格式无效', 'error'); }
  };
  reader.readAsText(file);
  event.target.value = '';
  closeDropdown();
}

function resetAllData() {
  if (!confirm('确认清除所有数据（题目+知识库+易混淆点）？此操作不可恢复！')) return;
  if (!confirm('⚠️ 再次确认：所有数据将被永久删除！')) return;
  problems = [];
  knowledge = [];
  confusions = [];
  saveProblems();
  saveKnowledge();
  saveConfusions();
  renderCards();
  closeDropdown();
  showToast('🗑️ 所有数据已清空', 'success');
}

// ===================================================================
// 下拉菜单
// ===================================================================
function toggleDropdown(e) {
  e.stopPropagation();
  document.getElementById('dropdownMenu').classList.toggle('active');
}

function closeDropdown() {
  document.getElementById('dropdownMenu').classList.remove('active');
}

document.addEventListener('click', closeDropdown);

// ===================================================================
// 部署指南折叠
// ===================================================================
function toggleDeploy(header) {
  header.nextElementSibling.classList.toggle('open');
  header.querySelector('.deploy-toggle').classList.toggle('open');
}

// ===================================================================
// 键盘快捷键 & 遮罩层关闭
// ===================================================================
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (document.getElementById('knowledgePanel').classList.contains('open')) { closeKnowledgePanel(); return; }
    if (document.getElementById('confusionPanel').classList.contains('open')) { closeConfusionPanel(); return; }
    if (document.getElementById('confusionFormModal').classList.contains('active')) { closeConfusionForm(); return; }
    if (document.getElementById('knowledgeFormModal').classList.contains('active')) { closeKnowledgeForm(); return; }
    if (document.getElementById('formModal').classList.contains('active')) closeFormModal();
    else if (document.getElementById('detailModal').classList.contains('active')) closeDetailModal();
  }
});

document.querySelectorAll('.modal-overlay').forEach(el => {
  el.addEventListener('click', function (e) {
    if (e.target === this) this.classList.remove('active');
  });
});

// ===================================================================
// 启动
// ===================================================================
document.addEventListener('DOMContentLoaded', init);
