import { StockTarget, CategoryData, RATING_ORDER, CATEGORY_COLORS, SortType, SortOrder } from '../types';

// 生成分类颜色
export function getCategoryColor(category: string, categoryIndex: number): string {
  // 使用分类名称生成一致的哈希颜色
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash) % CATEGORY_COLORS.length;
  return CATEGORY_COLORS[colorIndex];
}

// 按分类分组
export function groupByCategory(targets: StockTarget[]): CategoryData[] {
  const categoryMap = new Map<string, StockTarget[]>();

  targets.forEach(target => {
    if (!categoryMap.has(target.category)) {
      categoryMap.set(target.category, []);
    }
    categoryMap.get(target.category)!.push(target);
  });

  const categories: CategoryData[] = [];
  let index = 0;
  categoryMap.forEach((targets, category) => {
    categories.push({
      category,
      targets: targets.sort((a, b) => RATING_ORDER[b.rating] - RATING_ORDER[a.rating]),
      color: getCategoryColor(category, index++),
    });
  });

  // 按分类中标的数量降序排列
  categories.sort((a, b) => b.targets.length - a.targets.length);

  return categories;
}

// 排序标的
export function sortTargets(targets: StockTarget[], sortBy: SortType, order: SortOrder = 'desc'): StockTarget[] {
  const sorted = [...targets];

  switch (sortBy) {
    case 'rating':
      sorted.sort((a, b) => {
        const diff = RATING_ORDER[b.rating] - RATING_ORDER[a.rating];
        return order === 'asc' ? -diff : diff;
      });
      break;
    case 'completion':
      sorted.sort((a, b) => {
        const diff = a.completion - b.completion;
        return order === 'asc' ? diff : -diff;
      });
      break;
    case 'category':
      sorted.sort((a, b) => {
        const diff = a.category.localeCompare(b.category, 'zh-CN');
        return order === 'asc' ? diff : -diff;
      });
      break;
    default:
      break;
  }

  return sorted;
}

// 生成示例数据
export function generateSampleData(): StockTarget[] {
  return [
    { id: '1', name: '紫金矿业', category: '有色金属', tags: ['龙头', '成长'], rating: 'A+', completion: 95, lastUpdateDate: '2025-01-15' },
    { id: '2', name: '洛阳钼业', category: '有色金属', tags: ['稀缺', '海外'], rating: 'A', completion: 88, lastUpdateDate: '2025-01-14' },
    { id: '3', name: '中国铝业', category: '有色金属', tags: ['央企'], rating: 'B+', completion: 75, lastUpdateDate: '2025-01-13' },
    { id: '4', name: '江西铜业', category: '有色金属', tags: ['龙头'], rating: 'A', completion: 90, lastUpdateDate: '2025-01-12' },
    { id: '5', name: '云南铜业', category: '有色金属', tags: ['区域'], rating: 'B', completion: 70, lastUpdateDate: '2025-01-11' },
    { id: '6', name: '五矿稀土', category: '有色金属', tags: ['稀土'], rating: 'B+', completion: 80, lastUpdateDate: '2025-01-10' },
    { id: '7', name: '西部矿业', category: '有色金属', tags: ['西部'], rating: 'B', completion: 72, lastUpdateDate: '2025-01-09' },
    { id: '8', name: '驰宏锌锗', category: '有色金属', tags: ['铅锌'], rating: 'B+', completion: 78, lastUpdateDate: '2025-01-08' },
    { id: '9', name: '中金岭南', category: '有色金属', tags: ['铅锌'], rating: 'B', completion: 68, lastUpdateDate: '2025-01-07' },
    { id: '10', name: '神火股份', category: '有色金属', tags: ['铝业'], rating: 'A-', completion: 85, lastUpdateDate: '2025-01-06' },
    { id: '11', name: '贵州茅台', category: '白酒', tags: ['龙头', '高端'], rating: 'A+', completion: 98, lastUpdateDate: '2025-01-15' },
    { id: '12', name: '五粮液', category: '白酒', tags: ['龙头'], rating: 'A+', completion: 95, lastUpdateDate: '2025-01-14' },
    { id: '13', name: '泸州老窖', category: '白酒', tags: ['高端'], rating: 'A', completion: 88, lastUpdateDate: '2025-01-13' },
    { id: '14', name: '海螺水泥', category: '水泥', tags: ['龙头'], rating: 'A', completion: 92, lastUpdateDate: '2025-01-15' },
    { id: '15', name: '华新水泥', category: '水泥', tags: ['中部'], rating: 'B+', completion: 82, lastUpdateDate: '2025-01-14' },
    { id: '16', name: '塔牌集团', category: '水泥', tags: ['区域'], rating: 'B', completion: 75, lastUpdateDate: '2025-01-13' },
    { id: '17', name: '冀东水泥', category: '水泥', tags: ['华北'], rating: 'B+', completion: 78, lastUpdateDate: '2025-01-12' },
    { id: '18', name: '万年青', category: '水泥', tags: ['区域'], rating: 'B', completion: 72, lastUpdateDate: '2025-01-11' },
    { id: '19', name: '上峰水泥', category: '水泥', tags: ['成长'], rating: 'B+', completion: 80, lastUpdateDate: '2025-01-10' },
  ];
}

// 导出数据为JSON
export function exportToJSON(data: any, filename: string = 'stock-data.json') {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// 从JSON导入数据
export function importFromJSON(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}
