import { useState } from 'react';
import { StockTarget, CategoryData, SortType, SortOrder } from '../types';
import { groupByCategory, sortTargets } from '../utils/dataUtils';

interface SidebarProps {
  targets: StockTarget[];
  selectedTargetId: string | null;
  selectedCategory: string | null;
  onSelectTarget: (target: StockTarget) => void;
  onSelectCategory: (category: string, categoryData: CategoryData) => void;
}

const ratingOrder: Record<string, number> = {
  'A+': 7, 'A': 6, 'B+': 5, 'B': 4, 'C+': 3, 'C': 2, 'D': 1,
};

export default function Sidebar({
  targets,
  selectedTargetId,
  selectedCategory,
  onSelectTarget,
  onSelectCategory,
}: SidebarProps) {
  const [viewMode, setViewMode] = useState<'category' | 'list'>('category');
  const [sortBy, setSortBy] = useState<SortType>('rating');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const getRatingColor = (rating: string) => {
    if (rating.startsWith('A')) return 'text-green-600 bg-green-50 border-green-200';
    if (rating.startsWith('B')) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getCompletionColor = (completion: number) => {
    if (completion >= 90) return 'bg-green-500';
    if (completion >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // 分类视图
  const categoryViewData = groupByCategory(targets);

  // 列表视图（已排序）
  const listViewData = sortTargets(targets, sortBy, sortOrder);

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* 头部 */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 mb-3">股票标的</h2>

        {/* 视图切换 */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setViewMode('category')}
            className={`flex-1 px-3 py-1.5 text-sm rounded-lg transition-colors ${
              viewMode === 'category'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            分类视图
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex-1 px-3 py-1.5 text-sm rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            列表视图
          </button>
        </div>

        {/* 排序控制（仅列表视图） */}
        {viewMode === 'list' && (
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortType)}
              className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="rating">按评级</option>
              <option value="completion">按完成度</option>
              <option value="category">按分类</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        )}
      </div>

      {/* 内容区 */}
      <div className="flex-1 overflow-y-auto">
        {viewMode === 'category' ? (
          // 分类视图
          <div className="p-2">
            {categoryViewData.map((categoryData) => (
              <div key={categoryData.category} className="mb-2">
                {/* 分类标题 */}
                <button
                  onClick={() => {
                    toggleCategory(categoryData.category);
                    onSelectCategory(categoryData.category, categoryData);
                  }}
                  className={`w-full px-3 py-2 rounded-lg flex items-center justify-between transition-colors ${
                    selectedCategory === categoryData.category
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                  style={{ borderLeft: `4px solid ${categoryData.color}` }}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">{categoryData.category}</span>
                    <span className="text-xs text-gray-500">({categoryData.targets.length})</span>
                  </div>
                  <span className="text-gray-400">
                    {expandedCategories.has(categoryData.category) ? '▼' : '▶'}
                  </span>
                </button>

                {/* 分类下的标的列表 */}
                {expandedCategories.has(categoryData.category) && (
                  <div className="ml-4 mt-1 space-y-1">
                    {categoryData.targets.map((target) => (
                      <button
                        key={target.id}
                        onClick={() => onSelectTarget(target)}
                        className={`w-full px-3 py-2 rounded-lg text-left transition-colors ${
                          selectedTargetId === target.id
                            ? 'bg-blue-100 border border-blue-300'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-800 text-sm">{target.name}</span>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded border ${getRatingColor(target.rating)}`}>
                            {target.rating}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          {target.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${getCompletionColor(target.completion)}`}
                              style={{ width: `${target.completion}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{target.completion}%</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          // 列表视图
          <div className="p-2 space-y-1">
            {listViewData.map((target) => (
              <button
                key={target.id}
                onClick={() => onSelectTarget(target)}
                className={`w-full px-3 py-2 rounded-lg text-left transition-colors ${
                  selectedTargetId === target.id
                    ? 'bg-blue-100 border border-blue-300'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-800 text-sm">{target.name}</span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded border ${getRatingColor(target.rating)}`}>
                    {target.rating}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-500">{target.category}</span>
                  {target.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${getCompletionColor(target.completion)}`}
                      style={{ width: `${target.completion}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{target.completion}%</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
