sed -n 's#.*\/in/\([^/]*\)/.*#https://www.linkedin.com/in/\1/#p' a.txt | uniq > final2.txt
→ without numbering

sed -n 's#.*\/in/\([^/]*\)/.*#https://www.linkedin.com/in/\1/#p' a.txt | uniq | awk '{n++; print NR, $0}' > final2.txt
→ with numbering to check the total number

sed -n 's#.*\/in/\([^/]*\)/.*#\1#p' a.txt | uniq > final4.txt
→ for id only (*this one will be used*)
