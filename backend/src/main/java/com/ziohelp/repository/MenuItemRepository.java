package com.ziohelp.repository;

import com.ziohelp.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByIsActiveTrueOrderBySortOrder();
    List<MenuItem> findByCategoryAndIsActiveTrueOrderBySortOrder(String category);
}
