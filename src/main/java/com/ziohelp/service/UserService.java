package com.ziohelp.service;

import com.ziohelp.entity.User;
import com.ziohelp.exception.ResourceNotFoundException;
import com.ziohelp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public User approveUser(Long id) {
        User user = getUserById(id);
        user.setApproved(true);
        return userRepository.save(user);
    }

    public User disableUser(Long id) {
        User user = getUserById(id);
        user.setActive(false);
        return userRepository.save(user);
    }
} 