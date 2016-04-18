my_arr = (1..6000).to_a.reverse
# my_arr = (1...6000).to_a.shuffle

# define algorithm here (you'll need lo and hi for the beginning/endpoints on the recursive call)
def quicksort(arr, lo, hi)
  if lo < hi
    p = partition(arr, lo, hi)
    quicksort(arr, lo, p-1)
    quicksort(arr, p+1, hi)
  end
end

# partition function (selects a pivot and sorts into partitions)
def partition(arr, lo, hi)
  pivot = arr[hi]

  left = lo
  for element in (lo...hi)
    if arr[element] <= pivot
      arr[left], arr[element] = arr[element], arr[left]
      left += 1
    end
  end

  arr[left], arr[hi] = arr[hi], arr[left]
  return left
end

quicksort(my_arr, 0, my_arr.length-1)
puts my_arr == (1..my_arr.length).to_a ? 'Sorted!' : 'Nope, not sorted!'

# testing quicksort
test = (1..10).to_a.shuffle
quicksort(test, 0, test.length-1)

if test == (1..10).to_a
  puts 'The sort worked!'
else
  puts 'Noooo, the sort failed!'
end